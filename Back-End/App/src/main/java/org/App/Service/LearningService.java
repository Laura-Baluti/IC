package org.App.Service;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.ai.inference.models.ChatCompletions;
import com.azure.ai.inference.models.ChatCompletionsOptions;
import com.azure.ai.inference.models.ChatMessageContentItem;
import com.azure.ai.inference.models.ChatMessageImageContentItem;
import com.azure.ai.inference.models.ChatMessageTextContentItem;
import com.azure.ai.inference.models.ChatRequestMessage;
import com.azure.ai.inference.models.ChatRequestUserMessage;
import com.azure.ai.inference.models.ChatRequestSystemMessage;
import com.azure.core.credential.AzureKeyCredential;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public final class LearningService {

    @Autowired
    private FileService fileService;

    // Set your credentials
    @Value("${azure.ai.key}")
    private String key;

    @Value("${azure.ai.endpoint}")
    private String endpoint;

    @Value("${azure.ai.model}")
    private String model;

    private static final String IMAGE_FORMAT = "jpg";

    public String describePdf(ObjectId fileId, String userQuestion) throws Exception {
        // Convert PDF to images from MongoDB
        List<Path> imagePaths = convertPdfToImages(fileId);

        try {
            // Build the client
            ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                    .credential(new AzureKeyCredential(key))
                    .endpoint(endpoint)
                    .buildClient();

            // Prepare content (text + images)
            List<ChatMessageContentItem> contentItems = new ArrayList<>();
            contentItems.add(new ChatMessageTextContentItem(userQuestion));

            for (Path imgPath : imagePaths) {
                contentItems.add(new ChatMessageImageContentItem(imgPath, IMAGE_FORMAT));
            }

            List<ChatRequestMessage> chatMessages = new ArrayList<>();
            chatMessages.add(new ChatRequestSystemMessage("You are a teacher. You can either explain a PDF, make tests for a PDF, or both. Listen to the user and do what they ask. Make sure that your answers are long and precise."));
            chatMessages.add(ChatRequestUserMessage.fromContentItems(contentItems));

            ChatCompletionsOptions options = new ChatCompletionsOptions(chatMessages);
            options.setModel(model);

            ChatCompletions response = client.complete(options);
            return response.getChoice().getMessage().getContent();

        } finally {
            for (Path path : imagePaths) {
                Files.deleteIfExists(path);
            }
        }
    }

    // Convert all pages of a PDF to images (JPG)
    private List<Path> convertPdfToImages(ObjectId fileId) throws Exception {
        // Retrieve the file from MongoDB
        org.App.Model.File file = fileService.getFileById(fileId);
        if (file == null) throw new IllegalArgumentException("File not found in MongoDB.");

        // Load PDF document from binary data
        byte[] pdfBytes = file.getContent().getData();
        PDDocument document = PDDocument.load(pdfBytes);
        PDFRenderer pdfRenderer = new PDFRenderer(document);
        int pageCount = document.getNumberOfPages();

        List<Path> imagePaths = new ArrayList<>();
        for (int page = 0; page < pageCount; page++) {
            BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300);
            File outputFile = File.createTempFile("converted_page_" + (page + 1), ".jpg");
            ImageIO.write(image, IMAGE_FORMAT, outputFile);
            imagePaths.add(outputFile.toPath());
        }

        document.close();
        return imagePaths;
    }
}
