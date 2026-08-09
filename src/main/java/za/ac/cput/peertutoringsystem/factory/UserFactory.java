package za.ac.cput.peertutoringsystem.factory;

import za.ac.cput.peertutoringsystem.domain.Role;
import za.ac.cput.peertutoringsystem.domain.User;

public class UserFactory {

    public static User createUser(String firstName,
                                  String lastName,
                                  String email,
                                  String password,
                                  Role role) {

        return new User(
                null,
                firstName,
                lastName,
                email,
                password,
                role
        );
    }

}