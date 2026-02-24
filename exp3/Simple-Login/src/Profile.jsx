function Profile({ user, onLogout }) {
  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Profile;
