const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project',
});

connection.connect();

app.use(express.static(__dirname));

// Serve login.css
app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.css'));
});

// Serve login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Socket.io chat functionality
io.on('connection', (socket) => {
    console.log('A user connected');

    // Ask for the username
    socket.emit('request username');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('set username', (username) => {
        socket.username = username;
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', { message: data.message, username: socket.username });
        io.emit('chat message', { message: data.message, username: 'Opponent' }); // Hardcoded username for opponent
    });
});

// User signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password, age } = req.body;

    try {
        const emailExistsQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        connection.query(emailExistsQuery, [email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred' });
            }

            const emailExists = results[0].count > 0;

            if (emailExists) {
                return res.status(409).json({ message: 'Account already exists with this email' });
            }

            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error(hashError);
                    return res.status(500).json({ message: 'Error occurred' });
                }

                const insertUserQuery = 'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)';
                connection.query(insertUserQuery, [name, email, hashedPassword, age], (insertError) => {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).json({ message: 'Error occurred' });
                    }

                    res.status(200).json({ message: 'User signed up successfully' });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred' });
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        connection.query(getUserQuery, [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return res.status(200).json({ message: 'Login successful', redirect: '/home.html' });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred' });
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
