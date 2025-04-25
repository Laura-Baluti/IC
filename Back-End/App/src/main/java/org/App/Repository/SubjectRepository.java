package org.App.Repository;

import org.App.Model.Subject;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends MongoRepository<Subject, ObjectId> {

    List<Subject> findByUserId(ObjectId userId);

    void deleteByUserIdAndName(ObjectId userId, String name);
}
