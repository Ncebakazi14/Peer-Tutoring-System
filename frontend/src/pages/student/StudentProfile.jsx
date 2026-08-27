import { useState, useEffect } from "react";
import StudentApi from "../../api/StudentApi";
import "./StudentProfile.css";

function StudentProfile() {

    const [student, setStudent] = useState({
        studentId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        active: false
    });

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load student when page opens
    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const data = await StudentApi.getStudentById(1);

            setStudent({
                studentId: data.studentId || "",
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                dateOfBirth: data.dateOfBirth || "",
                active: data.active ?? false
            });

        } catch (error) {
            console.error("Error loading student:", error);
            alert("Unable to load student profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setStudent({
            ...student,
            [event.target.name]: event.target.value
        });

        setSaved(false);
    };

    const handleSave = async () => {
        try {
            const updatedStudent = await StudentApi.updateStudent(
                student.studentId,
                student
            );

            setStudent({
                ...updatedStudent,
                active: updatedStudent.active ?? student.active
            });

            setEditing(false);
            setSaved(true);

            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Error updating student:", error);
            alert("Unable to update profile.");
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setSaved(false);

        // Reload original data from backend
        loadStudent();
    };

    const getInitials = () => {
        const first = student.firstName?.charAt(0) || "";
        const last = student.lastName?.charAt(0) || "";

        return (first + last).toUpperCase();
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-message">
                    Loading student profile...
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* PAGE HEADER */}
            <div className="profile-header">

                <div>
                    <h1>My Profile</h1>

                    <p>
                        Manage your personal information and account details.
                    </p>
                </div>

                {!editing && (
                    <button
                        className="edit-profile-btn"
                        onClick={() => setEditing(true)}
                    >
                        ✏ Edit Profile
                    </button>
                )}

            </div>


            {/* PROFILE SUMMARY */}
            <div className="profile-summary-card">

                <div className="profile-avatar-large">
                    {getInitials()}
                </div>

                <div className="profile-summary-info">

                    <h2>
                        {student.firstName} {student.lastName}
                    </h2>

                    <p>{student.email}</p>

                    <span className="student-id">
                        Student ID: {student.studentId}
                    </span>

                </div>

                <div className="profile-status">

                    <span className="status-dot"></span>

                    <span>
                        {student.active
                            ? "Active Student"
                            : "Inactive"}
                    </span>

                </div>

            </div>


            {/* PERSONAL INFORMATION */}
            <div className="profile-card">

                <div className="section-header">

                    <div>
                        <h2>Personal Information</h2>

                        <p>
                            Your personal and contact information.
                        </p>
                    </div>

                </div>


                <div className="profile-form">

                    {/* FIRST NAME */}
                    <div className="form-group">

                        <label>First Name</label>

                        <input
                            type="text"
                            name="firstName"
                            value={student.firstName}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                    </div>


                    {/* LAST NAME */}
                    <div className="form-group">

                        <label>Last Name</label>

                        <input
                            type="text"
                            name="lastName"
                            value={student.lastName}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                    </div>


                    {/* EMAIL */}
                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            value={student.email}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                    </div>


                    {/* PHONE */}
                    <div className="form-group">

                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phoneNumber"
                            value={student.phoneNumber}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter phone number"
                        />

                    </div>


                    {/* DATE OF BIRTH */}
                    <div className="form-group">

                        <label>Date of Birth</label>

                        <input
                            type="date"
                            name="dateOfBirth"
                            value={student.dateOfBirth}
                            onChange={handleChange}
                            disabled={!editing}
                        />

                    </div>


                    {/* STUDENT ID */}
                    <div className="form-group">

                        <label>Student ID</label>

                        <input
                            type="text"
                            value={student.studentId}
                            disabled
                        />

                    </div>

                </div>


                {/* ACTION BUTTONS */}
                {editing && (

                    <div className="profile-actions">

                        <button
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button
                            className="save-btn"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>

                    </div>

                )}


                {saved && (

                    <div className="success-message">
                        ✓ Profile updated successfully.
                    </div>

                )}

            </div>


            {/* ACCOUNT STATUS */}
            <div className="account-status">

                <div>
                    <h2>Account Status</h2>

                    <p>
                        Your student account is currently active.
                    </p>
                </div>

                <div className="active-status">

                    <span className="status-dot"></span>

                    {student.active ? "Active" : "Inactive"}

                </div>

            </div>

        </div>
    );
}

export default StudentProfile;