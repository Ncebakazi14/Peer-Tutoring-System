import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
    const [page, setPage] = useState('login');

    return (
        <>
            {page === 'login' && (
                <Login onRegister={() => setPage('register')} />
            )}

            {page === 'register' && (
                <Register onLogin={() => setPage('login')} />
            )}
        </>
    );
}

export default App;