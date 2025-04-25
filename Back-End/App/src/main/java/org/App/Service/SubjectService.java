package org.App.Service;

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

    public List<Subject> getSubjectsByUserId(ObjectId userId) {
        return subjectRepository.findByUserId(userId);
    }
}
