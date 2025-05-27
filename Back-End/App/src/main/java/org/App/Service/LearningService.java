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

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public final class LearningService {

    // Set your credentials
    static String key = "";
    static String endpoint = "";
    static String model = "";

    // Path to the PDF file
    private static final String TEST_PDF_PATH = "";

    public static void main(String[] args) throws Exception {
        // Convert all pages of the PDF to images
        List<Path> imagePaths = convertPdfToImages(TEST_PDF_PATH);
        String imageFormat = "jpg"; // hardcoded as we save them in JPG

        // Build the client
        ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();

        // Prepare content items - text + images
        List<ChatMessageContentItem> contentItems = new ArrayList<>();
        contentItems.add(new ChatMessageTextContentItem("Explain everything that is in this PDF. I want to know more about it."));

        // Add each image from all pages
        for (Path imgPath : imagePaths) {
            contentItems.add(new ChatMessageImageContentItem(imgPath, imageFormat));
        }

        // Prepare chat messages
        List<ChatRequestMessage> chatMessages = new ArrayList<>();
        chatMessages.add(new ChatRequestSystemMessage("You are a PDF master. You will describe every PDF that you see."));
        chatMessages.add(ChatRequestUserMessage.fromContentItems(contentItems));

        // Prepare options with chat messages and model
        ChatCompletionsOptions options = new ChatCompletionsOptions(chatMessages);
        options.setModel(model);

        // Call the model
        ChatCompletions response = client.complete(options);

        // Output response
        String reply = response.getChoice().getMessage().getContent();
        System.out.println("Assistant: " + reply);
    }

    // Convert all pages of a PDF to images (JPG)
    private static List<Path> convertPdfToImages(String pdfPath) throws Exception {
        PDDocument document = PDDocument.load(new File(pdfPath));
        PDFRenderer pdfRenderer = new PDFRenderer(document);
        int pageCount = document.getNumberOfPages();

        List<Path> imagePaths = new ArrayList<>();

        for (int page = 0; page < pageCount; page++) {
            BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300); // Render each page at 300 DPI

            File outputFile = new File("converted_page_" + (page + 1) + ".jpg");
            ImageIO.write(image, "jpg", outputFile);

            imagePaths.add(outputFile.toPath());
        }

        document.close();
        return imagePaths;
    }
}
