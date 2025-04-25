package org.App.Controller;

import org.App.Model.Subject;
import org.App.Service.SubjectService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects/{userId}")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<Subject>> getSubjectsForUser(@PathVariable String userId) {
        try {
            ObjectId objectId = new ObjectId(userId);
            List<Subject> subjects = subjectService.getSubjectsByUserId(objectId);
            return ResponseEntity.ok(subjects);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Subject> addSubjectForUser(@PathVariable String userId, @RequestBody Subject newSubject) {
        try {
            if (newSubject.getName() == null || newSubject.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            ObjectId objectId = new ObjectId(userId);
            newSubject.setUserId(objectId);
            Subject addedSubject = subjectService.addSubject(newSubject);
            return ResponseEntity.ok(addedSubject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
