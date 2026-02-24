const express = require('express');
const fs = require('fs');
const path = require('path');
const FILE = "todos.json";

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

function readfile() {
    return new Promise((resolve) => {
        fs.readFile(FILE, "utf-8", (err, data) => {
            if (err) {
                resolve({ users: {} });
                return;
            }
            try {
                return resolve(data.trim() ? JSON.parse(data) : { users: {} });
            } catch (parseErr) {
                return resolve({ users: {} });
            }
        });
    });
}

function writefile(data) {
    return new Promise((resolve) => {
        fs.writeFile(FILE, JSON.stringify(data, null, 2), (err) => {
            resolve(!err);
        });
    });
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const data = await readfile();
    
    if (data.users[username] && data.users[username].password === password) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/listtodos', async (req, res) => {
    const username = req.query.username;
    const data = await readfile();
    const todos = data.users[username]?.todos || [];
    res.json(todos);
});

app.post('/addtodo', async (req, res) => {
    const { todo, username } = req.body;
    const data = await readfile();
    
    if (!data.users[username]) {
        data.users[username] = { todos: [] };
    }
    
    data.users[username].todos.push({ todo, status: "❌" });
    const success = await writefile(data);
    
    res.json({ message: success ? "todo added successfully" : "error occured" });
});

app.delete('/deltodo', async (req, res) => {
    const { todo, username } = req.body;
    const data = await readfile();
    
    const todos = data.users[username]?.todos || [];
    const index = todos.findIndex((item) => item.todo === todo);
    
    if (index !== -1) {
        todos.splice(index, 1);
        await writefile(data);
        res.json({ message: "todo deleted successfully" });
    } else {
        res.json({ message: "todo not found" });
    }
});

app.put('/marktodo', async (req, res) => {
    const { todo, username } = req.body;
    const data = await readfile();
    
    const todos = data.users[username]?.todos || [];
    const index = todos.findIndex((item) => item.todo === todo);
    
    if (index === -1) {
        res.json({ message: "todo not found" });
        return;
    }
    
    todos[index].status = "✔️";
    const success = await writefile(data);
    
    res.json({ message: success ? "todo marked successfully" : "error occured" });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});