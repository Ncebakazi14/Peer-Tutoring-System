import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SessionsPage from './pages/sessions/SessionsPage';
import MySessionsPage from './pages/sessions/MySessionsPage';
import CreateSessionPage from './pages/sessions/CreateSessionPage';
import EditSessionPage from './pages/sessions/EditSessionPage';
import SessionDetailPage from './pages/sessions/SessionDetailPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sessions" replace />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/my-sessions" element={<MySessionsPage />} />
        <Route path="/sessions/new" element={<CreateSessionPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
        <Route path="/sessions/:id/edit" element={<EditSessionPage />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}