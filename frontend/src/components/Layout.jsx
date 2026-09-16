import { useAuth } from '../context/AuthContext';
import { I, icons } from './icons';

const TUTOR_NAV = [
  ['Dashboard', 'dashboard', '#'],
  ['My Profile', 'profile', '#'],
  ['My Subjects', 'subjects', '#'],
  ['My Sessions', 'sessions', '/my-sessions'],
  ['My Bookings', 'bookings', '/my-bookings'],
  ['Reviews', 'reviews', '#'],
  ['Earnings', 'earnings', '#'],
  ['Notifications', 'notifications', '#'],
  ['Settings', 'settings', '#'],
];

const STUDENT_NAV = [
  ['Dashboard', 'dashboard', '#'],
  ['Browse Tutors', 'browse', '/sessions'],
  ['My Bookings', 'bookings', '/my-bookings'],
  ['My Reviews', 'reviews', '#'],
  ['Messages', 'messages', '#'],
  ['Notifications', 'notifications', '#'],
  ['Settings', 'settings', '#'],
];

export default function Layout({ role = 'tutor', active = '', title, subtitle, action, children }) {
  const { user } = useAuth();
  const nav = role === 'student' ? STUDENT_NAV : TUTOR_NAV;
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <I size={18}>{icons.cap}</I> PEER TUTORING
        </div>
        <nav className="app-nav">
          {nav.map(([label, icon, to]) => (
            <a key={label} href={to} className={label === active ? 'app-nav-item active' : 'app-nav-item'}>
              <I size={16}>{icons[icon]}</I> {label}
            </a>
          ))}
          <a href="#" className="app-nav-item">
            <I size={16}>{icons.logout}</I> Logout
          </a>
        </nav>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <button className="app-icon-btn" title="Notifications">
            <I size={18}>{icons.bell}</I>
          </button>
          <div className="app-avatar">{initials}</div>
        </header>

        <div className="app-content">
          <div className="app-header">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {action}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
