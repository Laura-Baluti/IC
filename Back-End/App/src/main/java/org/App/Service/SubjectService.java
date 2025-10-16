package org.App.Service;

import org.App.Model.File;
import org.App.Model.Subject;
import org.App.Repository.SubjectRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private FastFileService fastFileService;

    @Autowired
    private GradeService gradeService;

    public List<Subject> getSubjectsByUserId(ObjectId userId) {
        return subjectRepository.findByUserId(userId);
    }

    public Subject addSubject(Subject newSubject) {
        return subjectRepository.save(newSubject);
    }

    public void deleteSubjectByUserIdAndName(ObjectId userId, String name) {
        subjectRepository.deleteByUserIdAndName(userId, name);
    }

    public Subject getSubjectById(ObjectId subjectId) {
        return subjectRepository.findById(subjectId).orElse(null);
    }

    public boolean deleteSubjectsByUserId(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        List<Subject> subjects = subjectRepository.findByUserId(userObjectId);

        if (subjects.isEmpty()) {
            return false;
        }

        for (Subject subject : subjects) {
            fileService.deleteFilesBySubjectId(subject.getId().toHexString());
            fastFileService.deleteFastFilesBySubjectId(subject.getId().toHexString());
            gradeService.deleteGradesBySubjectId(subject.getId().toHexString());
        }

        subjectRepository.deleteAll(subjects);
        return true;
    }
}
