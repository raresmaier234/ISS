const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { sequelize, User, Bug } = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
};

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], 'SECRET_KEY', (err, decoded) => {
        if (err) {
            console.error('JWT Verification error:', err);
            return res.sendStatus(401);
        }
        req.userId = decoded.id;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = await User.create({ username, password: hashedPassword, role });
        res.status(201).send({ token: generateToken(newUser) });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).send(error.message);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            console.error('Invalid credentials:', { username });
            return res.status(401).send('Invalid credentials');
        }
        res.send({ token: generateToken(user) });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).send(error.message);
    }
});

app.post('/api/bugs', authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newBug = await Bug.create({ name, description });
        const bugs = await Bug.findAll();
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', bugs }));
            }
        });
        res.status(201).send(newBug);
    } catch (error) {
        console.error('Error adding bug:', error);
        res.status(400).send(error.message);
    }
});

app.get('/api/bugs', authenticate, async (req, res) => {
    try {
        const bugs = await Bug.findAll();
        res.send(bugs);
    } catch (error) {
        console.error('Error fetching bugs:', error);
        res.status(400).send({ message: 'Failed to fetch bugs' });
    }
});

app.put('/api/bugs/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug.findByPk(id);
        if (!bug) return res.sendStatus(404);

        const { resolved } = req.body;
        bug.resolved = resolved;
        await bug.save();
        const bugs = await Bug.findAll();
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', bugs }));
            }
        });
        res.send(bug);
    } catch (error) {
        console.error('Error updating bug:', error);
        res.status(400).send(error.message);
    }
});

app.delete('/api/bugs/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await Bug.destroy({ where: { id } });
        const bugs = await Bug.findAll();
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', bugs }));
            }
        });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting bug:', error);
        res.status(400).send({ message: 'Failed to delete bug' });
    }
});

app.get('/api/users', authenticate, async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(400).send({ message: 'Failed to fetch users' });
    }
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

wss.on('connection', async (ws) => {
    const bugs = await Bug.findAll();
    ws.send(JSON.stringify({ type: 'init', bugs }));

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        if (data.type === 'addBug') {
            await Bug.create({ name: data.name, description: data.description });
        } else if (data.type === 'resolveBug') {
            await Bug.destroy({ where: { id: data.id } });
        }
        const bugs = await Bug.findAll();
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', bugs }));
            }
        });
    });
});

sequelize.sync()
    .then(() => {
        server.listen(8080, () => {
        });
    })
    .catch(error => {
        console.error('Error syncing database:', error);
    });

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
