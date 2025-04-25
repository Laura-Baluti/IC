package org.App.Controller;

import org.App.Service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        ObjectId userId = userService.authenticateUser(username, password);
        if (userId != null) {
            return ResponseEntity.ok().body(Collections.singletonMap("userId", userId.toHexString()));
        } else {
            return ResponseEntity.status(401).body("Date de autentificare incorecte!");
        }
    }


}
