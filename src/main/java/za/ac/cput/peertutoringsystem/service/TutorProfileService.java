package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.TutorProfile;

import java.util.List;

public interface TutorProfileService {

    TutorProfile create(TutorProfile tutorProfile);

    TutorProfile read(Long id);

    TutorProfile update(TutorProfile tutorProfile);

    void delete(Long id);

    List<TutorProfile> getAll();
}