package org.Site.Controller;

import jakarta.validation.Valid;
import org.Site.Model.File;
import org.Site.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {
    @Autowired
    private FileService fileService;

    @GetMapping("/see")
    public List<File> getAllFiles() {
        return fileService.getAllFiles();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addFile(@Valid @RequestBody File file) {
        return fileService.addFile(file);
    }

}
