import { useState } from 'react';

function Signup({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    
    const data = await res.json();
    if (res.ok) {
      alert('Signup successful!');
      onSwitch('login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/><br/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select><br/><br/>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <button onClick={() => onSwitch('login')}>Login</button></p>
    </div>
  );
}

export default Signup;
