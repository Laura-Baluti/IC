package org.App.Repository;

import org.App.Model.FastFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FastFileRepository extends MongoRepository<FastFile, ObjectId> {

    // Find all fast files linked to a subject
    List<FastFile> findBySubjectId(ObjectId subjectId);

    // Find one by subjectId and name
    Optional<FastFile> findBySubjectIdAndName(ObjectId subjectId, String name);
}
