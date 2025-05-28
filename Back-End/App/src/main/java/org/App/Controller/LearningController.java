package org.App.Controller;

import org.App.Service.LearningService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("learning-plan")
public class LearningController {

    @Autowired
    private LearningService learningService;

    @PostMapping("/{fileId}")
    public ResponseEntity<String> askAboutPdf(@PathVariable String fileId, @RequestParam String question) {
        try {
            String answer = learningService.describePdf(new ObjectId(fileId), question);
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
