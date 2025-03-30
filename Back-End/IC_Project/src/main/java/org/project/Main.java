package org.project;

import com.mongodb.client.*;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoException;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class Main {
    public static void main(String[] args) {
        String mongoURI = "mongodb+srv://raulbacer:<password>@database.0tgmm6f.mongodb.net/?retryWrites=true&w=majority&appName=DataBase";

        ServerApi serverApi = ServerApi.builder()
                .version(ServerApiVersion.V1)
                .build();
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(mongoURI))
                .serverApi(serverApi)
                .build();

        try (MongoClient mongoClient = MongoClients.create(settings)) {
            MongoDatabase database = mongoClient.getDatabase("DataBase");

            MongoIterable<String> collectionNames = database.listCollectionNames();
            collectionNames.forEach((String collectionName) -> System.out.println(collectionName));

            database.runCommand(new Document("ping", 1));

            MongoCollection<Document> collection = database.getCollection("yourCollectionName");

            // Create a new document to insert into the collection
            Document newData = new Document("name", "John Doe")
                    .append("age", 30)
                    .append("email", "john.doe@example.com");

            // Insert the document into the collection
            collection.insertOne(newData);

            // Optionally print out the document inserted
            System.out.println("Document inserted: " + newData);
        } catch (Exception e) {
            System.err.println("Error connecting to MongoDB: " + e.getMessage());
        }
    }
}