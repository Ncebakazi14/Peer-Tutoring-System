package za.ac.cput.peertutoringsystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.peertutoringsystem.service.IStudentService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final IStudentService studentService;

    public ReviewController(IStudentService studentService) {
        this.studentService = studentService;
    }


}
