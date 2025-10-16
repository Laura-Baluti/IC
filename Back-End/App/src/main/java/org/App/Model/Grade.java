package org.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "grades")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Grade {
    @Id
    private ObjectId id;
    private ObjectId subjectId;
    private double value;
    private String description;

    // Constructor for creating new grades
    public Grade(ObjectId subjectId, double value, String description) {
        this.subjectId = subjectId;
        this.value = value;
        this.description = description != null ? description : "Evaluare";
    }
}