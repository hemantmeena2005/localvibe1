import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Chat from '@/components/Chat';
import Avatar from '@/components/Avatar';
import { buildApiUrl } from '@/utils/config';

export default function VibeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token } = useAuth();
  const [vibe, setVibe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(buildApiUrl(`/vibes/${id}`))
      .then(res => res.json())
      .then(data => { setVibe(data); setForm(data); setLoading(false); })
      .catch(() => setError('Failed to load vibe'));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEdit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(buildApiUrl(`/vibes/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          location: {
            ...form.location,
            coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])]
          }
        })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to update vibe');
      setEditMode(false);
      setVibe({ ...form });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vibe?')) return;
    try {
      const res = await fetch(buildApiUrl(`/vibes/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete vibe');
      router.push('/vibes');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const res = await fetch(buildApiUrl(`/vibes/${id}/rsvp`), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    const updated = await fetch(buildApiUrl(`/vibes/${id}`)).then(r => r.json());
    setVibe(updated);
    setForm(updated);
  };

  if (!vibe) return <div><Navbar /><div style={{ maxWidth: 600, margin: '40px auto' }}>Loading...</div></div>;

  const isCreator = user && vibe.creator && (user.id === vibe.creator._id || user.id === vibe.creator);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <h2>Vibe Details</h2>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        {editMode ? (
          <form onSubmit={handleEdit} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <input name="time" type="datetime-local" value={form.time?.slice(0,16)} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            <button type="submit" style={{ padding: 10, width: '100%' }}>Save</button>
            <button type="button" onClick={() => setEditMode(false)} style={{ padding: 10, width: '100%', marginTop: 8 }}>Cancel</button>
          </form>
        ) : (
          <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            <h3>{vibe.title}</h3>
            <p>{vibe.description}</p>
            <p><b>Category:</b> {vibe.category}</p>
            <p><b>Time:</b> {vibe.time ? new Date(vibe.time).toLocaleString() : 'N/A'}</p>
            <p><b>Address:</b> {vibe.address || 'N/A'}</p>
            <p><b>City:</b> {vibe.city || 'N/A'}</p>
            <p><b>Creator:</b> {vibe.creator?.username || vibe.creator?.email || 'Unknown'}</p>
            <p><b>Attendees:</b> {vibe.attendees?.length || 0}</p>
            {user && (
              <button onClick={handleRSVP} style={{ marginRight: 8, padding: '8px 16px' }}>
                {vibe.attendees && vibe.attendees.includes(user.id) ? 'Un-RSVP' : 'RSVP'}
              </button>
            )}
            {isCreator && (
              <div style={{ marginTop: 16 }}>
                <button onClick={() => setEditMode(true)} style={{ marginRight: 8, padding: '8px 16px' }}>Edit</button>
                <button onClick={handleDelete} style={{ padding: '8px 16px', background: '#e00', color: '#fff' }}>Delete</button>
              </div>
            )}
          </div>
        )}
        {/* Attendees List */}
        <div style={{ marginTop: 24 }}>
          <h4>Attendees</h4>
          {vibe.attendees && vibe.attendees.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {vibe.attendees.map(att => (
                <div key={att._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar user={att} size={32} />
                  <span>{att.username || att.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#888' }}>No attendees yet.</div>
          )}
        </div>
        {user && <Chat vibeId={vibe._id} user={user} />}
      </div>
    </>
  );
} 