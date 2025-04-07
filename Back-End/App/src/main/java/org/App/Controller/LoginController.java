package org.App.Controller;

import org.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private UserService userService;

    // POST endpoint for login
    @PostMapping
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        // Use the UserService to authenticate the user
        boolean isAuthenticated = userService.authenticateUser(username, password);

        // If authentication is successful, return a success response
        if (isAuthenticated) {
            return ResponseEntity.ok().body("Autentificare realizata cu succes!");
        } else {
            // If authentication fails, return an error response
            return ResponseEntity.status(401).body("Date de autentificare incorecte!");
        }
    }


}
