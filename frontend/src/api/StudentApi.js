import axios from "axios";

const API_URL = "http://localhost:8080/api/students";

const StudentApi = {

    // Get all students
    getAllStudents: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Get student by IDN
    getStudentById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Update student
    updateStudent: async (id, studentData) => {
        const response = await axios.put(
            `${API_URL}/${id}`,
            studentData
        );

        return response.data;
    },

    // Delete/deactivate student
    deleteStudent: async (id) => {
        const response = await axios.delete(
            `${API_URL}/${id}`
        );

        return response.data;
    }
};

export default StudentApi;