import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { buildApiUrl } from '@/utils/config';
import VibesMap from '@/components/VibesMap';
import Autosuggest from 'react-autosuggest';

export default function Vibes() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: '', time: '', address: '', city: '' });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [marker, setMarker] = useState(null); // [lat, lng]
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let url = buildApiUrl('/vibes');
    if (searchTerm) url += `?search=${searchTerm}`;
    if (category) url += `${searchTerm ? '&' : '?'}category=${category}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => { setVibes(data); setLoading(false); });
  }, [searchTerm, category]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(buildApiUrl('/vibes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to create vibe');
      setForm({ title: '', description: '', category: '', time: '', address: '', city: '' });
      setCreating(c => !c);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRSVP = async (vibeId) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const res = await fetch(buildApiUrl(`/vibes/${vibeId}/rsvp`), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!res.ok) throw new Error('Failed to RSVP');
    setCreating(c => !c); // trigger reload
  };

  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();
    setSearching(true);
    setLoading(true);
  };

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    setForm(f => ({ ...f, location: { type: 'Point', coordinates: [latlng[1], latlng[0]] } }));
  };

  // City autosuggest handlers
  const onCitySuggestionsFetchRequested = async ({ value }) => {
    if (!value) return setCitySuggestions([]);
    // Use Nominatim for city suggestions
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(value)}&format=json&limit=5`);
    const data = await res.json();
    setCitySuggestions(data);
  };
  const onCitySuggestionsClearRequested = () => setCitySuggestions([]);
  const getCitySuggestionValue = suggestion => suggestion.display_name;
  const renderCitySuggestion = suggestion => (
    <div>{suggestion.display_name}</div>
  );
  const onCityChange = (e, { newValue }) => {
    setCityInput(newValue);
    setForm(f => ({ ...f, city: newValue }));
  };
  const onCitySuggestionSelected = (e, { suggestion }) => {
    setForm(f => ({ ...f, city: suggestion.display_name }));
    setCityInput(suggestion.display_name);
    // If coordinates available, update marker and location
    if (suggestion.lat && suggestion.lon) {
      const lat = parseFloat(suggestion.lat);
      const lng = parseFloat(suggestion.lon);
      setMarker([lat, lng]);
      setForm(f => ({ ...f, location: { type: 'Point', coordinates: [lng, lat] } }));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#181818', padding: '40px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', color: '#222' }}>
          <h2 style={{ margin: '32px 0 24px 0', fontSize: 32, fontWeight: 700 }}>Vibes</h2>
          <div style={{ marginBottom: 32 }}>
            <VibesMap vibes={vibes} onLocationSelect={handleMapClick} markerPosition={marker} />
          </div>
          <form onSubmit={handleSearch} style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <input name="search" placeholder="Search by event or city" value={search} onChange={handleSearchChange} style={{ padding: 12, flex: 1, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
            <button type="submit" style={{ padding: '12px 32px', borderRadius: 8, background: '#222', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16 }}>Search</button>
          </form>
          {user ? (
            <form onSubmit={handleSubmit} style={{ marginBottom: 40, border: '1px solid #888', borderRadius: 12, padding: 24, background: '#111', color: '#fff', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Create a Vibe</h3>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
              <input name="category" placeholder="Category (e.g. Music, Tech)" value={form.category} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
              <input name="time" type="datetime-local" value={form.time} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }} />
              <Autosuggest
                suggestions={citySuggestions}
                onSuggestionsFetchRequested={onCitySuggestionsFetchRequested}
                onSuggestionsClearRequested={onCitySuggestionsClearRequested}
                getSuggestionValue={getCitySuggestionValue}
                renderSuggestion={renderCitySuggestion}
                inputProps={{
                  placeholder: 'City',
                  value: cityInput,
                  onChange: onCityChange,
                  style: { width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #888', fontSize: 16, background: '#222', color: '#fff' }
                }}
                onSuggestionSelected={onCitySuggestionSelected}
              />
              <div style={{ marginBottom: 12, color: '#fff' }}>
                <b>Set location on map (optional):</b>
                {marker && (
                  <span style={{ marginLeft: 8, fontSize: 13 }}>
                    Lat: {marker[0].toFixed(5)}, Lng: {marker[1].toFixed(5)}
                  </span>
                )}
              </div>
              <button type="submit" style={{ padding: '12px 32px', borderRadius: 8, background: '#fff', color: '#222', border: 'none', fontWeight: 700, fontSize: 16, marginTop: 8 }}>Create Vibe</button>
              {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            </form>
          ) : null}
          {loading ? <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading vibes...</div> : (
            <div style={{ marginTop: 32 }}>
              {vibes.length === 0 ? <div style={{ color: '#888', textAlign: 'center' }}>No vibes yet.</div> : (
                vibes.map(vibe => (
                  <div key={vibe._id} style={{ border: '1px solid #eee', borderRadius: 14, padding: 24, background: '#fff', marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{vibe.title}</h3>
                    <div style={{ margin: '10px 0 0 0', color: '#222', fontSize: 16 }}>{vibe.description}</div>
                    <div style={{ margin: '10px 0 0 0', color: '#444', fontSize: 15 }}><b>Category:</b> {vibe.category}</div>
                    <div style={{ color: '#444', fontSize: 15 }}><b>Time:</b> {vibe.time ? new Date(vibe.time).toLocaleString() : 'N/A'}</div>
                    <div style={{ color: '#444', fontSize: 15 }}><b>Address:</b> {vibe.address || 'N/A'}</div>
                    <div style={{ color: '#444', fontSize: 15 }}><b>City:</b> {vibe.city || 'N/A'}</div>
                    <div style={{ color: '#444', fontSize: 15 }}><b>Creator:</b> {vibe.creator?.username || vibe.creator?.email || 'Unknown'}</div>
                    <div style={{ color: '#444', fontSize: 15, marginBottom: 10 }}><b>Attendees:</b> {vibe.attendees?.length || 0}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {user && (
                        <button onClick={() => handleRSVP(vibe._id)} style={{ padding: '8px 20px', borderRadius: 6, background: user && vibe.attendees && vibe.attendees.includes(user.id) ? '#222' : '#fff', color: user && vibe.attendees && vibe.attendees.includes(user.id) ? '#fff' : '#222', border: '1px solid #222', fontWeight: 600 }}>
                          {user && vibe.attendees && vibe.attendees.includes(user.id) ? 'Un-RSVP' : 'RSVP'}
                        </button>
                      )}
                      <Link href={`/vibes/${vibe._id}`} style={{ padding: '8px 20px', borderRadius: 6, background: '#222', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>View Details</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 