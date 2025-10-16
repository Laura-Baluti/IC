package org.App.Service;

import org.App.Model.FastFile;
import org.App.Model.Grade;
import org.App.Model.Subject;
import org.App.Repository.GradeRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public List<Grade> getGradesBySubjectId(ObjectId subjectId) {
        return gradeRepository.findBySubjectId(subjectId);
    }

    public Grade addGrade(ObjectId subjectId, double value, String description) {
        Grade grade = new Grade(subjectId, value, description);
        return gradeRepository.save(grade);
    }

    public boolean deleteGradeByDescription(ObjectId subjectId, String description) {
        Optional<Grade> grade = gradeRepository.findBySubjectIdAndDescription(subjectId, description);
        if (grade.isPresent()) {
            gradeRepository.deleteBySubjectIdAndDescription(subjectId, description);
            return true;
        }
        return false;
    }

    public boolean deleteGradesBySubjectId(String subjectId) {
        ObjectId subjectObjectId = new ObjectId(subjectId);
        List<Grade> grades = gradeRepository.findBySubjectId(subjectObjectId);

        if (grades.isEmpty()) {
            return false;
        }

        gradeRepository.deleteAll(grades);
        return true;
    }
}