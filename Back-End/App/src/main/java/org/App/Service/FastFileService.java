package org.App.Service;

import org.App.Model.FastFile;
import org.App.Repository.FastFileRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FastFileService {

    @Autowired
    private FastFileRepository fastFileRepository;

    // Create or save a FastFile
    public FastFile createFastFile(String subjectId, String name, String content) {
        FastFile fastFile = new FastFile();
        fastFile.setSubjectId(new ObjectId(subjectId));
        fastFile.setName(name);
        fastFile.setContent(content);
        return fastFileRepository.save(fastFile);
    }

    // Get all FastFiles for a subject
    public List<FastFile> getFastFilesBySubjectId(ObjectId subjectId) {
        return fastFileRepository.findBySubjectId(subjectId);
    }

    // Get a FastFile by ID
    public FastFile getFastFileById(ObjectId fastFileId) {
        return fastFileRepository.findById(fastFileId).orElse(null);
    }

    // Delele fast file by ID
    public boolean deleteFastFileById(ObjectId id) {
        if (fastFileRepository.existsById(id)) {
            fastFileRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Delete all FastFiles for a subject
    public boolean deleteFastFilesBySubjectId(String subjectId) {
        ObjectId subjectObjectId = new ObjectId(subjectId);
        List<FastFile> files = fastFileRepository.findBySubjectId(subjectObjectId);

        if (files.isEmpty()) {
            return false;
        }

        fastFileRepository.deleteAll(files);
        return true;
    }
}
