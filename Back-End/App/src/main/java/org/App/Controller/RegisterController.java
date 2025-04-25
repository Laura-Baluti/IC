package org.App.Controller;

import org.App.Model.User;
import org.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            boolean isRegistered = userService.registerUser(user);

            if (isRegistered) {
                return ResponseEntity.ok().body("Inregistrare realizata cu succes!");
            } else {
                return ResponseEntity.status(400).body("Numele deja exista!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la inregistrare: " + e.getMessage());
        }
    }
}
