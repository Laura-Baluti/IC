package org.Site;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
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
    private String name;
    private String text;
}
