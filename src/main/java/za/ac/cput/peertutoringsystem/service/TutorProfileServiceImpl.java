package za.ac.cput.peertutoringsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.peertutoringsystem.domain.Role;
import za.ac.cput.peertutoringsystem.domain.TutorProfile;
import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.dto.TutorProfileResponseDTO;
import za.ac.cput.peertutoringsystem.exception.ForbiddenOperationException;
import za.ac.cput.peertutoringsystem.repository.TutorProfileRepository;
import za.ac.cput.peertutoringsystem.repository.UserRepository;

import java.util.List;

@Service
public class TutorProfileServiceImpl implements TutorProfileService {

    private final TutorProfileRepository tutorProfileRepository;
    private final UserRepository userRepository;

    public TutorProfileServiceImpl(
            TutorProfileRepository tutorProfileRepository,
            UserRepository userRepository) {
        this.tutorProfileRepository = tutorProfileRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public TutorProfile create(TutorProfile tutorProfile, String email) {
        User user = getTutorUser(email);

        if (tutorProfileRepository.findByUserEmail(email).isPresent()) {
            throw new IllegalStateException("You already have a tutor profile");
        }

        tutorProfile.setUser(user);
        return tutorProfileRepository.save(tutorProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public TutorProfile read(Long id) {
        return tutorProfileRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public TutorProfile getMyProfile(String email) {
        return tutorProfileRepository.findByUserEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public TutorProfile update(TutorProfile tutorProfile, String email) {
        getTutorUser(email);
        TutorProfile existingProfile = tutorProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "You do not have a tutor profile yet"));

        if (tutorProfile.getId() != null
                && !tutorProfile.getId().equals(existingProfile.getId())) {
            throw new ForbiddenOperationException(
                    "You cannot update another tutor's profile");
        }

        existingProfile.setBio(tutorProfile.getBio());
        existingProfile.setQualification(tutorProfile.getQualification());
        existingProfile.setAvailability(tutorProfile.getAvailability());
        return tutorProfileRepository.save(existingProfile);
    }

    @Override
    @Transactional
    public void delete(Long id, String email) {
        getTutorUser(email);
        TutorProfile existingProfile = tutorProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Tutor profile not found"));

        if (!existingProfile.getId().equals(id)) {
            throw new ForbiddenOperationException(
                    "You cannot delete another tutor's profile");
        }

        tutorProfileRepository.delete(existingProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorProfileResponseDTO> getAll() {
        return tutorProfileRepository.findAll().stream()
                .map(profile -> {
                    User user = profile.getUser();
                    return new TutorProfileResponseDTO(
                            profile.getId(),
                            user == null ? "" : user.getFirstName(),
                            user == null ? "" : user.getLastName(),
                            profile.getQualification(),
                            profile.getBio(),
                            profile.getAvailability());
                })
                .toList();
    }

    private User getTutorUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != Role.TUTOR) {
            throw new ForbiddenOperationException(
                    "Only tutor accounts can manage tutor profiles");
        }

        return user;
    }
}