package org.App.Repository;

import org.App.Model.File;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<File, ObjectId> {

    Optional<File> findByName(String name);
}