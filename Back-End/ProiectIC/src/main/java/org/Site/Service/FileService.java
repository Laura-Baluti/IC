package org.Site.Service;

import org.Site.Repository.FileRepository;
import org.Site.Model.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }

    public ResponseEntity<String> addFile(File file) {
        if (file.getName() != null && file.getId() != null) {
            fileRepository.save(file);
            return new ResponseEntity<String>("The file was added successfully!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<String>("This file is invalid!", HttpStatus.BAD_REQUEST);
        }
    }
}
