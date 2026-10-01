const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());


function getUsers() {
    return JSON.parse(fs.readFileSync('users.json', 'utf-8'));
}

function saveUsers(data) {
    fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
}


app.post('/user', (req, res) => {
    const users = getUsers();
    const { name, age, email } = req.body;

    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.json({ message: "Email already exists." });
    }

    const newUser = { id: users.length + 1, name, age, email };
    users.push(newUser);
    saveUsers(users);

    res.json({ message: "User added successfully." });
});


app.patch('/user/:id', (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.json({ message: "User ID not found." });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.age) user.age = req.body.age;
    if (req.body.email) user.email = req.body.email;

    saveUsers(users);
    res.json({ message: "User age updated successfully." });
});


app.delete(['/user', '/user/:id'], (req, res) => {
    let users = getUsers();
    const id = req.params.id || req.body.id;

    const userIndex = users.findIndex(u => u.id == id);
    if (userIndex === -1) {
        return res.json({ message: "User ID not found." });
    }

    users.splice(userIndex, 1);
    saveUsers(users);

    res.json({ message: "User deleted successfully." });
});


app.get('/user/getByName', (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.name === req.query.name);

    if (!user) {
        return res.json({ message: "User name not found." });
    }

    res.json(user);
});


app.get('/user', (req, res) => {
    res.json(getUsers());
});


app.get('/user/filter', (req, res) => {
    const users = getUsers();
    const result = users.filter(u => u.age >= req.query.minAge);

    if (result.length === 0) {
        return res.json({ message: "no user found" });
    }

    res.json(result);
});


app.get('/user/:id', (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.json({ message: "User not found." });
    }

    res.json(user);
});

app.listen(3000, () => console.log("Server is running on port 3000"));