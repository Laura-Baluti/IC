package org.App.Controller;

import org.App.Model.File;
import org.App.Model.Subject;
import org.App.Service.FileService;
import org.App.Service.LearningService;
import org.App.Service.SubjectService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("learning-plan")
public class LearningController {

    @Autowired
    private LearningService learningService;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private FileService fileService;

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

    @GetMapping("/find/{subjectId}")
    public ResponseEntity<List<Map<String, Object>>> getFilesBySubjectId(@PathVariable String subjectId) {
        try {
            ObjectId objectId = new ObjectId(subjectId);
            Subject subject = subjectService.getSubjectById(objectId);

            if (subject != null) {
                List<File> files = fileService.getFilesBySubjectId(objectId);

                List<Map<String, Object>> fileList = files.stream()
                        .map(file -> {
                            Map<String, Object> fileMap = new HashMap<>();
                            fileMap.put("fileId", file.getId().toHexString());
                            fileMap.put("subjectId", file.getSubjectId().toHexString());
                            fileMap.put("name", file.getName());
                            fileMap.put("contentType", file.getContentType());
                            fileMap.put("content", file.getContent().getData()); // optional: omit or convert to Base64
                            return fileMap;
                        })
                        .collect(Collectors.toList());

                return ResponseEntity.ok(fileList);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
