package org.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "grades")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Grade {

    @Id
    private ObjectId id;
    private ObjectId subjectId;

    private double content;
}
