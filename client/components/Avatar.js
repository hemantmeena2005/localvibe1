function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

export default function Avatar({ user, size = 36 }) {
  if (!user) return null;
  const initials = user.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email ? user.email[0].toUpperCase() : '?');
  const bg = stringToColor(user.username || user.email || 'U');
  return user.profilePicture ? (
    <img
      src={user.profilePicture}
      alt={user.username || user.email}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size / 2
      }}
      title={user.username || user.email}
    >
      {initials}
    </div>
  );
} 