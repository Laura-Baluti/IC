package org.App.Controller;

import org.App.Model.Grade;
import org.App.Service.GradeService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:5173") // Adjusted for your frontend URL
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @PostMapping("/add/{subjectId}")
    public ResponseEntity<?> addGrade(
            @PathVariable String subjectId,
            @RequestBody Map<String, Object> gradeData) {

        try {
            // Validate subjectId
            ObjectId objSubjectId;
            try {
                objSubjectId = new ObjectId(subjectId);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid subjectId format"));
            }

            // Extract value and description from request body
            if (!gradeData.containsKey("value") || !gradeData.containsKey("description")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing value or description"));
            }

            double value;
            try {
                value = Double.parseDouble(gradeData.get("value").toString());
                if (value < 0 || value > 10) { // Assuming grades are 0-10
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Grade value must be between 0 and 10"));
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid grade value"));
            }

            String description = gradeData.get("description").toString();

            // Add the grade
            Grade savedGrade = gradeService.addGrade(objSubjectId, value, description);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Grade added successfully",
                    "gradeId", savedGrade.getId().toString(),
                    "grade", savedGrade
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<?> getGrades(@PathVariable String subjectId) {
        try {
            ObjectId objSubjectId = new ObjectId(subjectId);
            List<Grade> grades = gradeService.getGradesBySubjectId(objSubjectId);
            return ResponseEntity.ok(grades);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid subjectId format"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{subjectId}/{description}")
    public ResponseEntity<?> deleteGrade(
            @PathVariable String subjectId,
            @PathVariable String description) {

        try {
            ObjectId objSubjectId = new ObjectId(subjectId);
            boolean deleted = gradeService.deleteGradeByDescription(objSubjectId, description);

            if (deleted) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Grade deleted successfully"
                ));
            } else {
                return ResponseEntity.status(404) // Use status(404) instead of notFound()
                        .body(Map.of("error", "Grade not found with the given description"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid subjectId format"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
}