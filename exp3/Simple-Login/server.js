import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './users.json';

app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  const users = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  users.push({ name, email, password, role });
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  res.json({ message: 'Signup successful' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ user: { name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
