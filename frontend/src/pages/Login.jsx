
import { useState } from 'react';
import authService from '../services/authService';

function getUserRole(token) {
    try {
        const tokenParts = token.split('.');

        if (tokenParts.length !== 3) {
            throw new Error('The server returned an invalid token.');
        }

        const base64Payload = tokenParts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const paddedPayload = base64Payload.padEnd(
            Math.ceil(base64Payload.length / 4) * 4,
            '='
        );

        const payload = JSON.parse(
            decodeURIComponent(
                Array.from(atob(paddedPayload), (character) =>
                    '%' + character.charCodeAt(0)
                        .toString(16)
                        .padStart(2, '0')
                ).join('')
            )
        );

        const rawRole =
            payload.role ??
            payload.roles ??
            payload.authority ??
            payload.authorities;

        const roleValue = Array.isArray(rawRole)
            ? rawRole[0]
            : rawRole;

        const roleName =
            typeof roleValue === 'object' && roleValue !== null
                ? roleValue.authority ?? roleValue.role ?? roleValue.name
                : roleValue;

        return String(roleName ?? '')
            .replace(/^ROLE_/i, '')
            .toUpperCase();
    } catch {
        throw new Error('Unable to identify your account role from the token.');
    }
}

function Login({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await authService.login({ email, password });

            if (!result?.token) {
                throw new Error(
                    'The server did not return an authentication token.'
                );
            }

            const role = getUserRole(result.token);

            if (!['TUTOR', 'STUDENT', 'ADMIN'].includes(role)) {
                throw new Error(
                    'Your account role could not be identified. Please contact support.'
                );
            }

            // Save the token only after validating the token and role.
            localStorage.setItem('token', result.token);

            if (role === 'TUTOR') {
                window.location.href = '/tutor/dashboard';
            } else {
                window.location.href = '/student/dashboard';
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password.');
            } else if (err.response?.status === 403) {
                setError(
                    'Access denied by the server. Please check your account permissions.'
                );
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(
                    err.message ||
                    'Unable to log in. Please check that the backend is running.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">🎓</div>

                <h1>Peer Tutoring</h1>

                <p className="login-subtitle">
                    Connect, learn and succeed together.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>

                        <button
                            type="button"
                            className="forgot-password"
                            onClick={() =>
                                alert('Password reset coming soon.')
                            }
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <p role="alert" style={{ color: '#c62828' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                    </button>
                </form>

                <p className="register-text">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        className="register-link"
                        onClick={onRegister}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
