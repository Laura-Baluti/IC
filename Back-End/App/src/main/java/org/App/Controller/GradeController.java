package org.App.Controller;

import org.App.Model.Grade;
import org.App.Service.GradeService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/note")
@CrossOrigin(origins = "*")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    // Get all grades for a specific subject - ENDPOINT PRINCIPAL
    @GetMapping("/note/{subjectId}")
    public ResponseEntity<List<Grade>> getGradesBySubject(@PathVariable String subjectId) {
        try {
            ObjectId objId = new ObjectId(subjectId);
            List<Grade> grades = gradeService.getGradesBySubjectId(objId);
            return new ResponseEntity<>(grades, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new grade
    @PostMapping
    public ResponseEntity<Grade> addGrade(@RequestBody Grade grade) {
        try {
            Grade savedGrade = gradeService.addGrade(grade);
            return new ResponseEntity<>(savedGrade, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}