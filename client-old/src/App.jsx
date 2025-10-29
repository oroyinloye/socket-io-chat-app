import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [privateChat, setPrivateChat] = useState([]);
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    socket.on('message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(''), 2000);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('userJoined', (user) => {
      setChat((prev) => [...prev, { system: true, message: `${user} joined the chat`, timestamp: Date.now() }]);
    });

    socket.on('userLeft', (user) => {
      setChat((prev) => [...prev, { system: true, message: `${user} left the chat`, timestamp: Date.now() }]);
    });

    socket.on('privateMessage', (data) => {
      setPrivateChat((prev) => [...prev, data]);

      if (Notification && Notification.permission === 'granted') {
        new Notification(`New message from ${data.from}`, {
          body: data.message
        });
      }
    });

    // Request notification permission once
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('onlineUsers');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('privateMessage');
      socket.disconnect();
    };
  }, []);

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const payload = { username, message, timestamp: Date.now() };
      socket.emit('message', payload);
      setChat((prev) => [...prev, payload]);
      setMessage('');
    }
  };

  const handleTyping = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    } else {
      socket.emit('typing', username);
    }
  };

  const reactToMessage = (index, emoji) => {
    setPrivateChat((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], reaction: emoji };
      return updated;
    });
  };

  const sendPrivateMessage = () => {
    if (recipient && privateMessage.trim()) {
      const payload = { from: username, to: recipient, message: privateMessage, timestamp: Date.now() };
      socket.emit('privateMessage', payload);
      setPrivateChat((prev) => [...prev, payload]);
      setPrivateMessage('');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {!joined ? (
        <div>
          <h2>Join Chat</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <>
          <h2>Welcome, {username}</h2>
          <p><strong>Online Users:</strong> {onlineUsers.join(', ')}</p>

          <div style={{ marginBottom: 8 }}>
            <button onClick={() => setActiveTab('global')}>🌍 Global Chat</button>
            <button onClick={() => setActiveTab('private')}>🔒 Private Chat</button>
          </div>

          {activeTab === 'global' && (
            <div>
              <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll', marginBottom: 8 }}>
                {chat.map((msg, idx) => (
                  <div key={idx}>
                    {msg.system ? (
                      <em>{msg.message} <span>({new Date(msg.timestamp).toLocaleTimeString()})</span></em>
                    ) : (
                      <div>
                        <strong>{msg.username}</strong>: {msg.message}
                        <em> ({new Date(msg.timestamp || Date.now()).toLocaleTimeString()})</em>
                      </div>
                    )}
                  </div>
                ))}
                {typingUser && <p><em>{typingUser} is typing...</em></p>}
              </div>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message and press Enter to send"
                style={{ width: '70%', marginRight: 8 }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}

          {activeTab === 'private' && (
            <div>
              <h4>Private Messages</h4>
              <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll', marginBottom: 8 }}>
                {privateChat.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <strong>{msg.from}</strong>: {msg.message}
                    <em> ({new Date(msg.timestamp || Date.now()).toLocaleTimeString()})</em>
                    {msg.reaction && <span> {msg.reaction}</span>}
                    <div>
                      <button onClick={() => reactToMessage(idx, '👍')}>👍</button>
                      <button onClick={() => reactToMessage(idx, '❤️')}>❤️</button>
                      <button onClick={() => reactToMessage(idx, '😂')}>😂</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 8 }}>
                <select onChange={(e) => setRecipient(e.target.value)} value={recipient}>
                  <option value="">Select recipient</option>
                  {onlineUsers.filter((u) => u !== username).map((user, idx) => (
                    <option key={idx} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              <input
                value={privateMessage}
                onChange={(e) => setPrivateMessage(e.target.value)}
                placeholder="Private message"
                style={{ width: '70%', marginRight: 8 }}
              />
              <button onClick={sendPrivateMessage}>Send</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
