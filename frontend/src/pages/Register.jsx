import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register({ onLogin }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const registrationData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
            };

            await authService.register(registrationData);

            setSuccess(
                `Registration successful! Your ${formData.role.toLowerCase()} account has been created. You can now log in.`
            );

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'STUDENT',
            });
        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;

            if (status === 400) {
                setError(
                    responseData?.message ||
                    'Some registration details are invalid. Please check your information.'
                );
            } else if (status === 401) {
                setError(
                    'The server requires authentication for registration. Please check the backend security configuration.'
                );
            } else if (status === 403) {
                setError(
                    'Registration was forbidden by the server (403). The backend security configuration or request handling needs to be checked.'
                );
            } else if (status === 409) {
                setError(
                    'This email may already be registered. Please use another email or log in.'
                );
            } else if (status >= 500) {
                setError(
                    'A server error occurred. Please check the Spring Boot console for details.'
                );
            } else if (err.response) {
                setError(
                    responseData?.message ||
                    `Registration failed with HTTP status ${status}.`
                );
            } else {
                setError(
                    'Could not reach the backend. Make sure Spring Boot is running and the frontend API proxy is configured correctly.'
                );
            }

            console.error('Registration error:', {
                status,
                response: responseData,
                message: err.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const goToLogin = () => {
        if (onLogin) {
            onLogin();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">🎓</div>

                <h1>Create Account</h1>

                <p className="login-subtitle">
                    Join the Peer Tutoring System.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            autoComplete="family-name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registerEmail">Email</label>
                        <input
                            id="registerEmail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registerPassword">Password</label>
                        <input
                            id="registerPassword"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            I want to register as
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="TUTOR">Tutor</option>
                        </select>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            style={{ color: '#c62828' }}
                        >
                            {error}
                        </p>
                    )}

                    {success && (
                        <p
                            role="status"
                            style={{ color: '#2e7d32' }}
                        >
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'CREATING ACCOUNT...'
                            : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <p className="register-text">
                    Already have an account?{' '}
                    <button
                        type="button"
                        className="register-link"
                        onClick={goToLogin}
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;