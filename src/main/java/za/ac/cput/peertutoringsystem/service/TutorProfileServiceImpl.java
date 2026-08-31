package za.ac.cput.peertutoringsystem.service;

import org.springframework.stereotype.Service;
import za.ac.cput.peertutoringsystem.domain.TutorProfile;
import za.ac.cput.peertutoringsystem.repository.TutorProfileRepository;

import java.util.List;

@Service
public class TutorProfileServiceImpl implements TutorProfileService {

    private final TutorProfileRepository tutorProfileRepository;

    public TutorProfileServiceImpl(TutorProfileRepository tutorProfileRepository) {
        this.tutorProfileRepository = tutorProfileRepository;
    }

    @Override
    public TutorProfile create(TutorProfile tutorProfile) {
        return tutorProfileRepository.save(tutorProfile);
    }

    @Override
    public TutorProfile read(Long id) {
        return tutorProfileRepository.findById(id).orElse(null);
    }

    @Override
    public TutorProfile update(TutorProfile tutorProfile) {
        return tutorProfileRepository.save(tutorProfile);
    }

    @Override
    public void delete(Long id) {
        tutorProfileRepository.deleteById(id);
    }

    @Override
    public List<TutorProfile> getAll() {
        return tutorProfileRepository.findAll();
    }
}