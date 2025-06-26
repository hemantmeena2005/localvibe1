import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/config';
import Avatar from './Avatar';

const BEEP_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

export default function Chat({ vibeId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const [windowFocused, setWindowFocused] = useState(true);
  const originalTitle = useRef(document.title);

  useEffect(() => {
    const onFocus = () => {
      setWindowFocused(true);
      document.title = originalTitle.current;
    };
    const onBlur = () => setWindowFocused(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinRoom', vibeId);
    socketRef.current.on('chatHistory', msgs => setMessages(msgs));
    socketRef.current.on('chatMessage', msg => {
      setMessages(msgs => [...msgs, msg]);
      // Notification: if not focused and not own message
      if (!windowFocused && (!user || msg.userId !== user.id)) {
        document.title = 'New message! | ' + originalTitle.current;
        try {
          const audio = new Audio(BEEP_URL);
          audio.play().catch(() => {}); // Ignore NotAllowedError
        } catch {}
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [vibeId, windowFocused, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current.emit('chatMessage', {
      vibeId,
      userId: user.id,
      username: user.username || user.email,
      message: input.trim()
    });
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 32 }}>
      <h4>Event Chat</h4>
      <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 8, background: '#fafafa', padding: 8 }}>
        {messages.map(msg => {
          const isOwn = user && (msg.userId === user.id);
          return (
            <div
              key={msg._id || msg.createdAt}
              style={{
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
              }}
            >
              {!isOwn && <Avatar user={{ username: msg.username, email: '' }} size={28} />}
              <div
                style={{
                  background: isOwn ? '#e0e7ff' : '#fff',
                  borderRadius: 12,
                  padding: '8px 12px',
                  maxWidth: '70%',
                  color: '#111',
                  textAlign: isOwn ? 'right' : 'left',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#111', marginBottom: 2 }}>{msg.username}</div>
                <div style={{ color: '#111' }}>{msg.message}</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
              </div>
              {isOwn && <Avatar user={{ username: msg.username, email: '' }} size={28} />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
      </form>
    </div>
  );
} 