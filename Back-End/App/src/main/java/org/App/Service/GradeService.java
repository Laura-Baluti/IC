package org.App.Service;

import org.App.Model.Grade;
import org.App.Repository.GradeRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    // Get all grades for a specific subject
    public List<Grade> getGradesBySubjectId(ObjectId subjectId) {
        return gradeRepository.findBySubjectId(subjectId);
    }

    // Add a new grade
    public Grade addGrade(Grade grade) {
        return gradeRepository.save(grade);
    }
}