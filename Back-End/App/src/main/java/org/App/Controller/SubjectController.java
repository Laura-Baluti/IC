package org.App.Controller;

import org.App.Model.Subject;
import org.App.Service.SubjectService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/subjects/{userId}")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getSubjectsForUser(@PathVariable String userId) {
        try {
            ObjectId objectId = new ObjectId(userId);
            List<Subject> subjects = subjectService.getSubjectsByUserId(objectId);

            // Mapping each subject and converting the subjectId to hex string
            List<Map<String, Object>> subjectsWithHexId = subjects.stream()
                    .map(subject -> {
                        Map<String, Object> subjectMap = new HashMap<>();
                        subjectMap.put("name", subject.getName());
                        subjectMap.put("subjectId", subject.getId().toHexString()); // Convert subjectId to hex string
                        subjectMap.put("userId", subject.getUserId().toHexString());
                        return subjectMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(subjectsWithHexId);
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

    @DeleteMapping("/{name}")
    public ResponseEntity<String> deleteSubject(
            @PathVariable String userId,
            @PathVariable String name) {
        try {
            ObjectId objectId = new ObjectId(userId);
            subjectService.deleteSubjectByUserIdAndName(objectId, name);
            return ResponseEntity.ok("Subject deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid user ID.");
        }
    }

}
