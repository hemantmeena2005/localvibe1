import Head from "next/head";
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Placeholder images (replace with real ones later)
const HERO_BG = 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2x1YnN8ZW58MHx8MHx8fDA%3D';
const VIBE_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1664474653221-8412b8dfca3e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXZlbnR8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
];
const AVATARS = [
  '/avatar1.png', '/avatar2.png', '/avatar3.png', '/avatar4.png', '/avatar5.png', '/avatar6.png'
];

// Add Unsplash images for features and final CTA
const FEATURE_IMAGES = [
  // Create Your Own Vibe
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&auto=format&fit=crop&q=60',
  // Live Map Discovery
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60',
  // Secure In-App Chat
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&auto=format&fit=crop&q=60',
];
const CTA_IMAGE = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&auto=format&fit=crop&q=60';

function IconMapSearch() {
  return <span style={{fontSize:32,display:'block'}}>🗺️</span>;
}
function IconUsers() {
  return <span style={{fontSize:32,display:'block'}}>👥</span>;
}
function IconMoodHappy() {
  return <span style={{fontSize:32,display:'block'}}>😄</span>;
}

export default function Home() {
  const { user } = useAuth();

  // --- Hero Section ---
  const hero = (
    <section style={{
      position: 'relative',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      background: `url(${HERO_BG}) center/cover no-repeat`,
      borderRadius: 24,
      overflow: 'hidden',
      margin: '32px 0 48px 0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(120deg, rgba(24,24,24,0.92) 60%, rgba(255,88,88,0.25) 100%)',
        zIndex: 1
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32
      }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: '-2px', background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Gwalior. Your Vibe.
        </h1>
        <p style={{ fontSize: 22, color: '#fff', fontWeight: 500, margin: 0, textShadow: '0 2px 8px #181818' }}>
          Discover secret foodie meetups, join late-night coding sessions, or start a photowalk at the Fort. Find your people on LocalVibe.
        </p>
        <Link href={user ? "/vibes" : "/register"} style={{
          marginTop: 16,
          padding: '18px 48px',
          fontSize: 22,
          fontWeight: 800,
          borderRadius: 12,
          background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(255,88,88,0.18)',
          border: 'none',
          textDecoration: 'none',
          letterSpacing: 1
        }}>
          Find My Vibe
        </Link>
      </div>
    </section>
  );

  // --- How It Works ---
  const howItWorks = (
    <section style={{ maxWidth: 900, margin: '0 auto 64px auto', padding: '0 16px' }}>
      <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, textAlign: 'center', marginBottom: 36 }}>Your Vibe in 3 Taps.</h2>
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, background: '#232323', borderRadius: 18, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
          <IconMapSearch />
          <h3 style={{ color: '#ff5858', fontWeight: 700, fontSize: 22, margin: '18px 0 8px 0' }}>Discover</h3>
          <p style={{ color: '#ccc', fontSize: 17 }}>Scroll through a live map of hangouts happening near you right now.</p>
        </div>
        <div style={{ flex: 1, minWidth: 220, background: '#232323', borderRadius: 18, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
          <IconUsers />
          <h3 style={{ color: '#ff5858', fontWeight: 700, fontSize: 22, margin: '18px 0 8px 0' }}>Join</h3>
          <p style={{ color: '#ccc', fontSize: 17 }}>See who's going, chat with them, and RSVP with a single tap.</p>
        </div>
        <div style={{ flex: 1, minWidth: 220, background: '#232323', borderRadius: 18, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
          <IconMoodHappy />
          <h3 style={{ color: '#ff5858', fontWeight: 700, fontSize: 22, margin: '18px 0 8px 0' }}>Vibe</h3>
          <p style={{ color: '#ccc', fontSize: 17 }}>Show up, meet cool people, and experience your city like never before.</p>
        </div>
      </div>
    </section>
  );

  // --- Featured Vibes ---
  const featuredVibes = (
    <section style={{ maxWidth: 1100, margin: '0 auto 64px auto', padding: '0 16px' }}>
      <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, textAlign: 'center', marginBottom: 36 }}>The Scene in Gwalior. Right Now.</h2>
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Card 1 */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 340, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,88,88,0.10)', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 160, background: `url(${VIBE_IMAGES[0]}) center/cover no-repeat` }} />
          <div style={{ padding: 24 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Chai & Code</h3>
            <div style={{ color: '#444', fontSize: 16, margin: '10px 0 0 0' }}>Indian Coffee House</div>
            <div style={{ color: '#888', fontSize: 15, margin: '8px 0' }}>3 people attending</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <img src={AVATARS[0]} alt="A" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[1]} alt="B" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[2]} alt="C" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 340, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,88,88,0.10)', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 160, background: `url(${VIBE_IMAGES[1]}) center/cover no-repeat` }} />
          <div style={{ padding: 24 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Morning Photowalk</h3>
            <div style={{ color: '#444', fontSize: 16, margin: '10px 0 0 0' }}>Fort Main Gate</div>
            <div style={{ color: '#888', fontSize: 15, margin: '8px 0' }}>5 people attending</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <img src={AVATARS[3]} alt="D" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[4]} alt="E" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[5]} alt="F" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <span style={{ color: '#888', fontWeight: 700, marginLeft: 8 }}>+2</span>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 340, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,88,88,0.10)', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 160, background: `url(${VIBE_IMAGES[2]}) center/cover no-repeat` }} />
          <div style={{ padding: 24 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Late Night FIFA Tournament</h3>
            <div style={{ color: '#444', fontSize: 16, margin: '10px 0 0 0' }}>Local Gaming Cafe</div>
            <div style={{ color: '#888', fontSize: 15, margin: '8px 0' }}>8 people attending</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <img src={AVATARS[0]} alt="A" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[2]} alt="C" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <img src={AVATARS[4]} alt="E" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee' }} />
              <span style={{ color: '#888', fontWeight: 700, marginLeft: 8 }}>+5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // --- Features Section ---
  const features = (
    <section style={{ maxWidth: 1100, margin: '0 auto 64px auto', padding: '0 16px' }}>
      <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, textAlign: 'center', marginBottom: 36 }}>Your City. Your Rules.</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center' }}>
        {/* Feature 1 */}
        <div style={{ flex: 1, minWidth: 320, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Create Your Own Vibe</h3>
            <p style={{ color: '#ccc', fontSize: 17, margin: '10px 0 0 0' }}>
              Don't see what you like? Create your own hangout in 30 seconds. You're in control.
            </p>
          </div>
          <img src={FEATURE_IMAGES[0]} alt="Create Vibe" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,88,88,0.10)' }} />
        </div>
        {/* Feature 2 */}
        <div style={{ flex: 1, minWidth: 320, display: 'flex', alignItems: 'center', gap: 24, flexDirection: 'row-reverse' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Live Map Discovery</h3>
            <p style={{ color: '#ccc', fontSize: 17, margin: '10px 0 0 0' }}>
              No more dead-end searches. See exactly where the vibes are on a real-time map.
            </p>
          </div>
          <img src={FEATURE_IMAGES[1]} alt="Map" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,88,88,0.10)' }} />
        </div>
        {/* Feature 3 */}
        <div style={{ flex: 1, minWidth: 320, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#ff5858', fontWeight: 800, fontSize: 22, margin: 0 }}>Secure In-App Chat</h3>
            <p style={{ color: '#ccc', fontSize: 17, margin: '10px 0 0 0' }}>
              Coordinate with attendees before you go. No need to share your phone number.
            </p>
          </div>
          <img src={FEATURE_IMAGES[2]} alt="Chat" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,88,88,0.10)' }} />
        </div>
      </div>
    </section>
  );

  // --- Final CTA ---
  const finalCTA = (
    <section style={{ background: '#0e1e1e', borderRadius: 24, maxWidth: 900, margin: '0 auto 64px auto', padding: '48px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, flex: 1, minWidth: 220 }}>
        Ready to Ditch the Boring?
        <div style={{ color: '#ccc', fontWeight: 500, fontSize: 18, marginTop: 10 }}>
          Your next favorite memory is happening right now. Go find it.
        </div>
      </div>
      <img src={CTA_IMAGE} alt="Last Call" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,88,88,0.10)', marginLeft: 24 }} />
      <Link href={user ? "/vibes" : "/register"} style={{
        marginTop: 0,
        padding: '18px 48px',
        fontSize: 22,
        fontWeight: 800,
        borderRadius: 12,
        background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(255,88,88,0.18)',
        border: 'none',
        textDecoration: 'none',
        letterSpacing: 1
      }}>
        Create My First Vibe
      </Link>
    </section>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#181818', paddingBottom: 60 }}>
      <Head>
        <title>LocalVibe - Find Your Vibe in the City</title>
        <meta name="description" content="Discover and create hyperlocal events, meet new people, and vibe with your city." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {hero}
      {howItWorks}
      {featuredVibes}
      {features}
      {finalCTA}
    </div>
  );
}
