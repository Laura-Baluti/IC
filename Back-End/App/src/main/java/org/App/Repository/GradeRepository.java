package org.App.Repository;

import org.App.Model.Grade;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends MongoRepository<Grade, ObjectId> {
    List<Grade> findBySubjectId(ObjectId subjectId);

    Optional<Grade> findBySubjectIdAndDescription(ObjectId subjectId, String description);

    void deleteBySubjectIdAndDescription(ObjectId subjectId, String description);
}