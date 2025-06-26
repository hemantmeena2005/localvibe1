import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { buildApiUrl } from '@/utils/config';

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const [userRes, vibesRes] = await Promise.all([
    fetch(`http://localhost:5001/api/users/${userId}`),
    fetch(`http://localhost:5001/api/users/${userId}/vibes`)
  ]);
  if (!userRes.ok) return { notFound: true };
  const user = await userRes.json();
  const vibes = vibesRes.ok ? await vibesRes.json() : { created: [], attending: [] };
  return { props: { user, vibes } };
}

export default function UserProfile({ user, vibes }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUser] = useState(user);
  const [vibesData, setVibes] = useState(vibes);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    Promise.all([
      fetch(buildApiUrl(`/users/${userId}`)),
      fetch(buildApiUrl(`/users/${userId}/vibes`))
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(([userData, vibesData]) => {
        setUser(userData);
        setVibes(vibesData);
        setLoading(false);
      })
      .catch(() => setError('Failed to load user'));
  }, [userId]);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Avatar user={userData} size={64} />
        <div>
          <h2>{userData.username}</h2>
          <div style={{ color: '#888' }}>{userData.email}</div>
          {userData.bio && <div style={{ marginTop: 8 }}>{userData.bio}</div>}
        </div>
      </div>
      <h3>Vibes I've Created</h3>
      {vibesData.created.length === 0 ? <div style={{ color: '#888' }}>No vibes created.</div> : (
        <ul>
          {vibesData.created.map(v => (
            <li key={v._id} style={{ marginBottom: 8 }}>
              <Link href={`/vibes/${v._id}`}>{v.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <h3 style={{ marginTop: 32 }}>Vibes I'm Attending</h3>
      {vibesData.attending.length === 0 ? <div style={{ color: '#888' }}>No RSVPs yet.</div> : (
        <ul>
          {vibesData.attending.map(v => (
            <li key={v._id} style={{ marginBottom: 8 }}>
              <Link href={`/vibes/${v._id}`}>{v.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 