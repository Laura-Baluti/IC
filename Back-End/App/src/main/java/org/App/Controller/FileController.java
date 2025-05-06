package org.App.Controller;

import org.App.Model.File;
import org.App.Service.FileService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/subjects/{userId}/{subjectId}")
public class FileController {

    @Autowired
    private FileService fileService;

    // Get all files for a given subjectId
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFilesForSubject(@PathVariable String subjectId) {
        try {
            ObjectId objectId = new ObjectId(subjectId);
            List<File> files = fileService.getFilesBySubjectId(objectId);

            // Mapping each file and converting the fileId to hex string
            List<Map<String, Object>> filesWithHexId = files.stream()
                    .map(file -> {
                        Map<String, Object> fileMap = new HashMap<>();
                        fileMap.put("name", file.getName());
                        fileMap.put("fileId", file.getId().toHexString()); // Convert fileId to hex string
                        fileMap.put("subjectId", file.getSubjectId().toHexString()); // Link file to subject
                        return fileMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(filesWithHexId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Add a file to a subject
    @PostMapping
    public ResponseEntity<File> addFileForSubject(@PathVariable String subjectId,
                                                  @RequestParam("file") MultipartFile newMultipartFile) {
        try {
            File file = fileService.uploadFile(subjectId, newMultipartFile);
            return ResponseEntity.status(201).body(file);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Delete a file by its name for a specific subject
    @DeleteMapping("/{name}")
    public ResponseEntity<String> deleteFile(@PathVariable String subjectId, @PathVariable String name) {
        try {
            boolean isDeleted = fileService.deleteFileByName(subjectId, name);
            if (isDeleted) {
                return ResponseEntity.ok("File deleted successfully.");
            } else {
                return ResponseEntity.status(404).body("File not found.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid subjectId or file name.");
        }
    }
}
