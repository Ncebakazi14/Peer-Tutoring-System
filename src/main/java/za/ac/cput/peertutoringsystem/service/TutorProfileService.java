
package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.TutorProfile;
import za.ac.cput.peertutoringsystem.dto.TutorProfileResponseDTO;

import java.util.List;

public interface TutorProfileService {

    TutorProfile create(TutorProfile tutorProfile, String email);

    TutorProfile read(Long id);

    TutorProfile getMyProfile(String email);

    TutorProfile update(TutorProfile tutorProfile, String email);

    void delete(Long id, String email);

    List<TutorProfileResponseDTO> getAll();
}
