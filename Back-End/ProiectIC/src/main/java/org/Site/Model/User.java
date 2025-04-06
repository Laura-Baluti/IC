package org.Site.Model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private ObjectId id;

    @NotBlank
    @Email(message = "Email should be valid!")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password should be at least 8 characters!")
    private String password;

    @NotBlank
    @Size(max = 20, message = "Username should be at most 20 characters!")
    private String username;

    private String photo;
}
