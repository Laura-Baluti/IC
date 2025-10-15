package org.App.Repository;

import org.App.Model.Grade;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository {

    // Find grades by subjectId
    List<Grade> findBySubjectId(ObjectId subjectId);

    // Add a new grade
    Grade save(Grade grade);
}
