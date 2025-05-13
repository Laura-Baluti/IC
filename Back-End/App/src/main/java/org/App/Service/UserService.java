package org.App.Service;

import org.App.Model.User;
import org.App.Repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ObjectId authenticateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);
        if (user.isPresent()) {
            return user.get().getId();
        }
        return null;
    }

    public boolean registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return false;
        }
        userRepository.save(user);
        return true;
    }

    public User getUserById(String id) {
        return userRepository.findById(new ObjectId(id)).orElse(null);
    }

}
