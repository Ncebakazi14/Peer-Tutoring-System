package za.ac.cput.peertutoringsystem.dto;

public class SubjectResponseDTO {

    private Long subjectId;
    private String code;
    private String name;
    private String description;

    public SubjectResponseDTO() {
    }

    public SubjectResponseDTO(Long subjectId, String code, String name, String description) {
        this.subjectId = subjectId;
        this.code = code;
        this.name = name;
        this.description = description;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}