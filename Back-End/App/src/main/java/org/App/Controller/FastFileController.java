package org.App.Controller;

import org.App.Model.FastFile;
import org.App.Service.FastFileService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/fastfiles/{userId}/{subjectId}")
public class FastFileController {

    @Autowired
    private FastFileService fastFileService;

    // Get all FastFiles for a subject
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFastFiles(@PathVariable String subjectId) {
        try {
            ObjectId subjectObjectId = new ObjectId(subjectId);
            List<FastFile> fastFiles = fastFileService.getFastFilesBySubjectId(subjectObjectId);

            List<Map<String, Object>> response = fastFiles.stream()
                    .map(f -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", f.getId().toHexString());
                        map.put("subjectId", f.getSubjectId().toHexString());
                        map.put("name", f.getName());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Create a new FastFile (simple text-based)
    @PostMapping
    public ResponseEntity<FastFile> createFastFile(@PathVariable String subjectId,
                                                   @RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            String content = body.get("content");

            if (name == null || content == null) {
                return ResponseEntity.badRequest().build();
            }

            FastFile saved = fastFileService.createFastFile(subjectId, name, content);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Get content of a FastFile
    @GetMapping("/download/{fastFileId}")
    public ResponseEntity<String> getFastFileContent(@PathVariable String fastFileId) {
        try {
            ObjectId fileId = new ObjectId(fastFileId);
            FastFile fastFile = fastFileService.getFastFileById(fileId);

            if (fastFile == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(fastFile.getContent());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete FastFile by ID
    @DeleteMapping("/delete/{fastFileId}")
    public ResponseEntity<String> deleteFastFileById(@PathVariable String fastFileId) {
        try {
            boolean deleted = fastFileService.deleteFastFileById(new ObjectId(fastFileId));
            if (deleted) {
                return ResponseEntity.ok("FastFile deleted successfully by ID.");
            } else {
                return ResponseEntity.status(404).body("FastFile not found.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid FastFile ID.");
        }
    }

}
