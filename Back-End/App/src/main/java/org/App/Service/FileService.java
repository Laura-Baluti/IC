package org.App.Service;

import org.App.Model.File;
import org.App.Repository.FileRepository;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    // Upload a file and associate it with a subject
    public File uploadFile(String subjectId, MultipartFile multipartFile) throws IOException {
        File file = new File();
        file.setName(multipartFile.getOriginalFilename());
        file.setContentType(multipartFile.getContentType());
        file.setContent(new Binary(multipartFile.getBytes()));
        file.setSubjectId(new ObjectId(subjectId)); // Link file to the subject
        return fileRepository.save(file);
    }

    // Get a file by its ID
    public Optional<File> getFileById(ObjectId id) {
        return fileRepository.findById(id);
    }

    // Get all files associated with a specific subject
    public List<File> getFilesBySubjectId(ObjectId subjectId) {
        return fileRepository.findBySubjectId(subjectId);
    }

    // Delete a file by its name and subject ID
    public boolean deleteFileByName(String subjectId, String name) {
        Optional<File> file = fileRepository.findBySubjectIdAndName(new ObjectId(subjectId), name);
        if (file.isPresent()) {
            fileRepository.delete(file.get());
            return true;
        }
        return false;
    }
}
