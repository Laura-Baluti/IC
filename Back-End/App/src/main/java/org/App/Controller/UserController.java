package org.App.Controller;

import org.App.Model.User;
import org.App.Service.SubjectService;
import org.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account/{userId}")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public User getUserInfo(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @DeleteMapping
    public void deleteUser(@PathVariable String userId) {
        subjectService.deleteSubjectsByUserId(userId);
        userService.deleteUserById(userId);
    }

}