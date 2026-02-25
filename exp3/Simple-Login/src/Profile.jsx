function Profile({ user, onLogout }) {
  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <p style={{ fontSize: '12px', margin: '0' }}>({user.role})</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Profile;
