// Part 1: Setting up Express and Socket.IO
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

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

io.on('connection', (socket) => {
    console.log('A user connected');

    // Read user information from XML
    const retrievedUser = readUserXML();

    try {
        if (retrievedUser && retrievedUser.email) {
            const email = retrievedUser.email;

            // Query the database for the username associated with the email
            const getUsernameQuery = 'SELECT username FROM users WHERE email = ?';
            connection.query(getUsernameQuery, [email], async (error, results) => {
                if (error) {
                    console.error(error);
                    return socket.emit('error', { message: 'Error occurred during database query' });
                }

                if (results.length === 0) {
                    return socket.emit('error', { message: 'User not found in the database' });
                }

                const dbUsername = results[0].username;
                console.log('Retrieved username from the database:', dbUsername);

                // Emit 'request username' event to the client
                socket.emit('request username');

                // Set the retrieved username for the socket
                socket.username = dbUsername;

                // Handle 'disconnect' event
                socket.on('disconnect', () => {
                    console.log('User disconnected');
                });

                // Handle 'set username' event
                socket.on('set username', (username) => {
                    // Set the username for the socket based on client input
                    socket.username = username;
                });

                // Handle 'chat message' event
                socket.on('chat message', (data) => {
                    // Emit 'chat message' event to all clients
                    io.emit('chat message', { message: data.message, username: socket.username });
                    console.log('chat message: ' + data.message, "username: ", socket.username);
                });
            });
        } else {
            console.log('User information not retrieved.');
            socket.emit('error', { message: 'User information not retrieved from XML' });
        }
    } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Error occurred during processing' });
    }
});

// Part 2: User signup endpoint and login endpoint
app.post('/signup', async (req, res) => {
    const { username, name, email, password, dob, profession } = req.body;

    try {
        const emailExistsQuery = 'SELECT username FROM users WHERE email = ?';
        connection.query(emailExistsQuery, [email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred' });
            }

            if (results.length > 0) {
                // Email already exists
                const existingUsername = results[0].username;
                return res.status(409).json({ message: `An account already exists with this email. Username: ${existingUsername}` });
            }

            const channelId = uuidv4(); // Generate a UUID for the channel ID

            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error(hashError);
                    return res.status(500).json({ message: 'Error occurred' });
                }

                const insertUserQuery = 'INSERT INTO users (username, name, email, password, dob, profession, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
                console.log("SQL Query:", insertUserQuery);

                connection.query(insertUserQuery, [username, name, email, hashedPassword, dob, profession, channelId], (insertError) => {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).json({ message: 'Error occurred' });
                    }

                    createUserXML(email); // Create XML for the user
                    res.status(200).json({ message: 'User signed up successfully', channelId });
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
    createUserXML(email);

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
                // Send the associated username for chat
                res.status(200).json({ message: 'Login successful', username: user.username, redirect: '/home.html' });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred' });
    }
});

// Part 3: Function to create XML for a user and XML read function
function createUserXML(email) {
    // Create an XML document using xmlbuilder
    const xml = xmlbuilder.create('user');
    xml.ele('email', email);

    // Convert the XML document to string
    const xmlString = xml.end({ pretty: true });

    // Write the XML content to a file
    const filePath = 'user.xml';
    fs.writeFileSync(filePath, xmlString);

    console.log(`User information has been stored in ${filePath}`);
}

// Function to read XML file and retrieve user information
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

async function readUserXML() {
    const filePath = 'user.xml';

    try {
        // Read the XML content from the file
        const xmlString = await readFileAsync(filePath, 'utf-8');

        // Parse the XML string using xml2js library
        const xml2js = require('xml2js');
        const parser = new xml2js.Parser({ explicitCharKey: true, trim: true });

        // Convert the parsing function to promise-based
        const parseStringPromise = util.promisify(parser.parseString);

        // Parse the XML string and return a promise
        const result = await parseStringPromise(xmlString);

        // Retrieve user information
        const email = result.user.email[0];
        console.log(`Retrieved user information from XML: ${email}`);

        // Return the email or any other user information
        return { email };
    } catch (error) {
        console.error(`Error reading/parsing XML file: ${error.message}`);
        throw error;
    }
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
