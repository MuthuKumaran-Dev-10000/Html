const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

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

app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.css'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
