package org.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "files")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class File {

    @Id
    private ObjectId id;
    private ObjectId subjectId;

    private String name;

    private String contentType;
    private Binary content;
}
