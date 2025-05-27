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

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public final class QuizService {

    //Adaug manual string-urile; nu merge cu .env
    static String key = "";
    static String endpoint = "";
    static String model = "";;

    private static final String TEST_IMAGE_PATH = "C:\\Users\\raulb\\Desktop\\Poza.jpg";
    private static final String TEST_IMAGE_FORMAT = "jpg";

    public static void main(String[] args) {

        // Build the client
        ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();

        Path imagePath = Paths.get(TEST_IMAGE_PATH);

        // Prepare content items - text + image
        List<ChatMessageContentItem> contentItems = new ArrayList<>();
        contentItems.add(new ChatMessageTextContentItem("Create me a quiz based on the photo."));  // prompt for the model
        contentItems.add(new ChatMessageImageContentItem(imagePath, TEST_IMAGE_FORMAT));

        // Prepare chat messages with system prompt and user message (with image content)
        List<ChatRequestMessage> chatMessages = new ArrayList<>();
        chatMessages.add(new ChatRequestSystemMessage("You are a quiz creator expert. You will recieve a photo and you will generate a quiz based on the information in the image. Make sure to mention the correct answer. It should be single choice."));
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
}