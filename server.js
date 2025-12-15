const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- AUTOMATIC SETUP (Self-Healing) ---
const DATA_DIR = path.join(__dirname, 'data');

// 1. Create data folder if missing
if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating 'data' folder...");
    fs.mkdirSync(DATA_DIR);
}

// 2. Define default data
const defaults = {
    'admins.json': [{ "email": "admin@lms.edu", "password": "123", "name": "Super Admin" }],
    'students.json': [{ "id": "233016112", "password": "pass123", "name": "John Doe", "email": "john@student.edu" }],
    'books.json': [
        { "id": 1, "title": "The Martian", "author": "Andy Weir", "isbn": "978-01314290", "quantity": 10, "available": 10 },
        { "id": 2, "title": "Deep Learning", "author": "Ian Goodfellow", "isbn": "978-01314291", "quantity": 5, "available": 5 }
    ],
    'issues.json': []
};

// 3. Create JSON files if missing
Object.keys(defaults).forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Creating default ${file}...`);
        fs.writeFileSync(filePath, JSON.stringify(defaults[file], null, 2));
    }
});

// --- HELPER FUNCTIONS ---
const readData = (file) => {
    try {
        const data = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        return JSON.parse(data);
    } catch (e) { return []; }
};

const writeData = (file, data) => {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Admin Login
app.post('/api/login/admin', (req, res) => {
    const { email, password } = req.body;
    const admins = readData('admins.json');
    const admin = admins.find(a => a.email === email && a.password === password);
    if (admin) res.json({ success: true, user: admin });
    else res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
});

// Student Login
app.post('/api/login/student', (req, res) => {
    const { id, password } = req.body;
    const students = readData('students.json');
    const student = students.find(s => s.id === id && s.password === password);
    if (student) res.json({ success: true, user: student });
    else res.status(401).json({ success: false, message: "Invalid Student Credentials" });
});

// Get Books
app.get('/api/books', (req, res) => {
    res.json(readData('books.json'));
});

// Add Book
app.post('/api/books', (req, res) => {
    const { title, author, isbn, quantity } = req.body;
    const books = readData('books.json');
    const newBook = { 
        id: Date.now(), 
        title, author, isbn, 
        quantity: parseInt(quantity), 
        available: parseInt(quantity) 
    };
    books.push(newBook);
    writeData('books.json', books);
    res.json({ success: true, message: "Book added" });
});

// Delete Book
app.post('/api/books/delete', (req, res) => {
    const { id } = req.body;
    let books = readData('books.json');
    books = books.filter(b => b.id !== id);
    writeData('books.json', books);
    res.json({ success: true, message: "Book deleted" });
});

// Get Members
app.get('/api/members', (req, res) => {
    res.json(readData('students.json'));
});

// Add Member
app.post('/api/members', (req, res) => {
    const { name, id, email } = req.body;
    const students = readData('students.json');
    if (students.find(s => s.id === id)) return res.json({ success: false, message: "ID exists" });
    
    students.push({ id, name, email, password: "pass123", date: new Date().toISOString().split('T')[0] });
    writeData('students.json', students);
    res.json({ success: true, message: "Member registered" });
});

// Issue Book
app.post('/api/issue', (req, res) => {
    const { studentId, isbn } = req.body;
    const books = readData('books.json');
    const students = readData('students.json');
    const issues = readData('issues.json');

    const bookIdx = books.findIndex(b => b.isbn === isbn);
    const studentExists = students.find(s => s.id === studentId);

    if (!studentExists) return res.json({ success: false, message: "Student ID not found" });
    if (bookIdx === -1) return res.json({ success: false, message: "Book ISBN not found" });
    if (books[bookIdx].available <= 0) return res.json({ success: false, message: "Book out of stock" });

    books[bookIdx].available -= 1;
    writeData('books.json', books);

    issues.push({ 
        id: Date.now(), 
        studentId, 
        isbn, 
        title: books[bookIdx].title, 
        date: new Date().toISOString().split('T')[0] 
    });
    writeData('issues.json', issues);

    res.json({ success: true, message: "Book Issued" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});