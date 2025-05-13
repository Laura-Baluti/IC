package org.App.Repository;

import org.App.Model.File;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<File, ObjectId> {

    // Find files by subjectId
    List<File> findBySubjectId(ObjectId subjectId);

    // Find a file by its subjectId and name
    Optional<File> findBySubjectIdAndName(ObjectId subjectId, String name);
}
