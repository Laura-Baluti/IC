package org.App.Controller;

import org.App.Model.Subject;
import org.App.Service.SubjectService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects/{userId}")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subject> getSubjectsForUser(@PathVariable ObjectId userId) {
        return subjectService.getSubjectsByUserId(userId);
    }
}
