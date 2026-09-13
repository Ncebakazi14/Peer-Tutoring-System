import { useState } from 'react';

function Login({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Login details:', {
            email,
            password
        });
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🎓
                </div>

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
                            onClick={() => alert('Password reset coming soon.')}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="login-button">
                        LOG IN
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?
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