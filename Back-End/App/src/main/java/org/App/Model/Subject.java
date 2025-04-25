package org.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subject {

    @Id
    private ObjectId id;
    private ObjectId userId;

    private String name;
}
