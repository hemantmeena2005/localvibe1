import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { buildApiUrl } from '@/utils/config';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vibes, setVibes] = useState({ created: [], attending: [] });
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    fetch(buildApiUrl(`/users/${user.id}/vibes`))
      .then(res => res.json())
      .then(data => { setVibes(data); setLoading(false); });
  }, [user, router]);

  const handleDelete = async (vibeId) => {
    if (!window.confirm('Are you sure you want to delete this vibe?')) return;
    await fetch(buildApiUrl(`/vibes/${vibeId}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setVibes(v => ({ ...v, created: v.created.filter(vb => vb._id !== vibeId) }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    await fetch(buildApiUrl(`/users/${user.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, profilePicture })
    });
    setUploading(false);
    setEditingProfile(false);
    user.bio = bio;
    user.profilePicture = profilePicture;
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#181818', padding: '40px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, color: '#222', background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <Avatar user={user} size={80} />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: '#222', fontSize: 32, fontWeight: 700 }}>{user.username}</h2>
              <div style={{ color: '#888', fontSize: 18 }}>{user.email}</div>
              {editingProfile ? (
                <form onSubmit={handleProfileSave} style={{ marginTop: 12 }}>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Bio"
                    style={{ width: '100%', height: 60, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc', padding: 10, fontSize: 16 }}
                  />
                  <input
                    value={profilePicture}
                    onChange={e => setProfilePicture(e.target.value)}
                    placeholder="Profile picture URL"
                    style={{ width: '100%', marginBottom: 12, borderRadius: 8, border: '1px solid #ccc', padding: 10, fontSize: 16 }}
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={uploading} style={{ padding: '8px 24px', borderRadius: 6, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }}>Save</button>
                    <button type="button" onClick={() => setEditingProfile(false)} style={{ padding: '8px 24px', borderRadius: 6, background: '#eee', color: '#222', border: 'none', fontWeight: 600 }}>Cancel</button>
                    <button type="button" onClick={() => setEditingProfile(false)} style={{ padding: '8px 24px', borderRadius: 6, background: '#f5f5f5', color: '#222', border: '1px solid #ccc', fontWeight: 600 }}>Go Back</button>
                  </div>
                </form>
              ) : (
                <>
                  {user.bio && <div style={{ marginTop: 12, color: '#222', fontSize: 16 }}>{user.bio}</div>}
                  <button onClick={() => setEditingProfile(true)} style={{ marginTop: 12, padding: '8px 24px', borderRadius: 6, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }}>Edit Profile</button>
                </>
              )}
              <button onClick={logout} style={{ marginTop: 18, padding: '8px 24px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>Logout</button>
            </div>
          </div>
          <h3 style={{ marginTop: 32, color: '#222', fontWeight: 700, fontSize: 22 }}>Vibes I've Created</h3>
          {loading ? <div>Loading...</div> : vibes.created.length === 0 ? <div style={{ color: '#888' }}>No vibes created.</div> : (
            <ul style={{ padding: 0, listStyle: 'none', marginTop: 18 }}>
              {vibes.created.map(v => (
                <li key={v._id} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #eee', borderRadius: 10, padding: 16, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <Link href={`/vibes/${v._id}`} style={{ fontWeight: 600, fontSize: 17 }}>{v.title}</Link>
                  <button onClick={() => router.push(`/vibes/${v._id}?edit=1`)} style={{ padding: '6px 18px', borderRadius: 5, border: '1px solid #222', background: '#222', color: '#fff', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => handleDelete(v._id)} style={{ padding: '6px 18px', color: '#fff', background: '#e00', border: 'none', borderRadius: 5, fontWeight: 600 }}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          <h3 style={{ marginTop: 40, color: '#222', fontWeight: 700, fontSize: 22 }}>Vibes I'm Attending</h3>
          {loading ? <div>Loading...</div> : vibes.attending.length === 0 ? <div style={{ color: '#888' }}>No RSVPs yet.</div> : (
            <ul style={{ padding: 0, listStyle: 'none', marginTop: 18 }}>
              {vibes.attending.map(v => (
                <li key={v._id} style={{ marginBottom: 18, border: '1px solid #eee', borderRadius: 10, padding: 16, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontWeight: 600, fontSize: 17 }}>
                  <Link href={`/vibes/${v._id}`}>{v.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
} 