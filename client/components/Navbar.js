import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee', position: 'relative' }}>
      <Link href="/">
        <span style={{ fontWeight: 'bold', fontSize: 20 }}>LocalVibe</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            <Link href="/dashboard" style={{ marginRight: 8 }}>Dashboard</Link>
            <Link href={`/users/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
              <Avatar user={user} size={32} />
              <span>{user.username || user.email}</span>
            </Link>
            <button onClick={logout} style={{ padding: '6px 16px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: 16 }}>Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
} 