package org.App.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public final class LearningService {

    @Autowired
    private FileService fileService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${xai.api.key}")
    private String apiKey;

    @Value("${xai.api.endpoint}")
    private String endpoint;

    @Value("${xai.api.model}")
    private String model;

    public String describePdf(ObjectId fileId, String userQuestion) throws Exception {
        // Extract text from PDF instead of converting to images
        String pdfText = extractTextFromPdf(fileId);

        try {
            // Prepare the request payload for Grok-3-Mini (text-only)
            Map<String, Object> requestPayload = prepareGrokRequest(userQuestion, pdfText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestPayload, headers);

            String url = endpoint + "/chat/completions";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // Log usage for cost monitoring
                if (responseBody.containsKey("usage")) {
                    Map<String, Object> usage = (Map<String, Object>) responseBody.get("usage");
                    System.out.println("Tokens used - Prompt: " + usage.get("prompt_tokens") +
                            ", Completion: " + usage.get("completion_tokens") +
                            ", Total: " + usage.get("total_tokens"));
                }

                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }

            throw new RuntimeException("Failed to get response from Grok API: " + response.getStatusCode());

        } catch (Exception e) {
            throw new RuntimeException("API call failed: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> prepareGrokRequest(String userQuestion, String pdfText) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", model);
        request.put("messages", Arrays.asList(
                Map.of(
                        "role", "system",
                        "content", "You are an expert teacher and tutor. You have access to a PDF document's full text content. " +
                                "You can explain concepts, create practice questions, summarize content, or answer specific questions. " +
                                "Provide detailed, accurate, and educational responses. Structure your answers clearly with explanations, " +
                                "examples, and step-by-step reasoning when appropriate. If the question relates to specific sections, " +
                                "reference the relevant content from the PDF. You can also create a test consisting of short questions."
                ),
                Map.of(
                        "role", "user",
                        "content", String.format(
                                "PDF Document Content:\\n\\n%s\\n\\n---\\n\\nUser Question: %s\\n\\nPlease provide a detailed answer based on the document content.",
                                truncateText(pdfText, 100000), // Limit to prevent token overflow
                                userQuestion
                        )
                )
        ));
        request.put("temperature", 0.7);
        request.put("max_tokens", 3000); // Reduced for text-only (cheaper)
        request.put("top_p", 0.9);
        return request;
    }

    // Extract text from PDF using PDFBox
    private String extractTextFromPdf(ObjectId fileId) throws Exception {
        org.App.Model.File file = fileService.getFileById(fileId);
        if (file == null) throw new IllegalArgumentException("File not found in MongoDB.");

        byte[] pdfBytes = file.getContent().getData();
        try (PDDocument document = PDDocument.load(pdfBytes)) {
            if (document.getNumberOfPages() == 0) {
                throw new IllegalArgumentException("PDF contains no pages");
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setStartPage(1);
            stripper.setEndPage(document.getNumberOfPages());

            String fullText = stripper.getText(document);

            // Clean up extracted text (remove excessive whitespace, page numbers)
            fullText = fullText.replaceAll("\\n\\s*\\n", "\n\n") // Normalize line breaks
                    .replaceAll("\\f", "") // Remove form feeds
                    .trim();

            System.out.println("Extracted " + fullText.length() + " characters from PDF");
            return fullText;
        }
    }

    // Truncate text to prevent token limit exceeded errors
    private String truncateText(String text, int maxChars) {
        if (text.length() <= maxChars) {
            return text;
        }

        // Find last sentence boundary or paragraph
        int truncatePoint = text.lastIndexOf('\n', maxChars - 1000);
        if (truncatePoint == -1) {
            truncatePoint = maxChars;
        }

        String truncated = text.substring(0, truncatePoint).trim();
        return truncated + "\n\n[Document truncated for processing - full content available but limited for this analysis]";
    }
}