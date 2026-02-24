import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import './App.css'

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  return (
    <div>
      {page === 'login' && <Login onSwitch={setPage} onLogin={handleLogin} />}
      {page === 'signup' && <Signup onSwitch={setPage} />}
      {page === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App
