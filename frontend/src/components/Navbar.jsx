import React from 'react';
import { CheckSquare, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ isOnline, onRefresh }) {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="brand">
        <div className="brand-icon">
          <CheckSquare size={22} />
        </div>
        <div>
          <h1 className="brand-title">TaskFlow</h1>
        </div>
        <span className="brand-badge">Full-Stack MERN</span>
      </div>

      <div
        className="server-status"
        id="server-status-pill"
        title={isOnline ? 'Connected to Express & MongoDB backend' : 'Backend offline or unreachable'}
        style={{ cursor: 'pointer' }}
        onClick={onRefresh}
      >
        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
        <span>{isOnline ? 'Backend Online' : 'Backend Disconnected'}</span>
        {isOnline ? <Wifi size={14} color="var(--accent-emerald)" /> : <WifiOff size={14} color="var(--accent-rose)" />}
      </div>
    </nav>
  );
}
