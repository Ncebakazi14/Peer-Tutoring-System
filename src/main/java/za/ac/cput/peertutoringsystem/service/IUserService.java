package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    void delete(Long id);
}