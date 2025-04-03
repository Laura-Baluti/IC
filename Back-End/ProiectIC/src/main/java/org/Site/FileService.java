package org.Site;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;
    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }
}
