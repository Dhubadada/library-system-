const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read data safely
const readData = (file) => {
    const filePath = path.join(__dirname, 'data', file);
    // If file doesn't exist, return empty array
    if (!fs.existsSync(filePath)) return [];
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return [];
    }
};

// Helper to write data
const writeData = (file, data) => {
    const filePath = path.join(__dirname, 'data', file);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${file}:`, err);
    }
};

// --- ROUTES ---

// 1. Admin Login
app.post('/api/login/admin', (req, res) => {
    const { email, password } = req.body;
    const admins = readData('admins.json');
    
    // Find matching admin
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
        res.json({ success: true, user: admin });
    } else {
        res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    }
});

// 2. Student Login
app.post('/api/login/student', (req, res) => {
    const { id, password } = req.body;
    const students = readData('students.json');
    const student = students.find(s => s.id === id && s.password === password);

    if (student) {
        res.json({ success: true, user: student });
    } else {
        res.status(401).json({ success: false, message: "Invalid Student Credentials" });
    }
});

// 3. Get All Books
app.get('/api/books', (req, res) => {
    const books = readData('books.json');
    res.json(books);
});

// 4. Add Book
app.post('/api/books', (req, res) => {
    const { title, author, isbn, quantity } = req.body;
    const books = readData('books.json');

    const newBook = {
        id: Date.now(),
        title,
        author,
        isbn,
        quantity: parseInt(quantity),
        available: parseInt(quantity) // Initially available = total quantity
    };

    books.push(newBook);
    writeData('books.json', books);
    res.json({ success: true, message: "Book added", book: newBook });
});

// 5. Delete Book
app.post('/api/books/delete', (req, res) => {
    const { id } = req.body;
    let books = readData('books.json');
    books = books.filter(b => b.id !== id);
    writeData('books.json', books);
    res.json({ success: true, message: "Book deleted" });
});

// 6. Get Members
app.get('/api/members', (req, res) => {
    const students = readData('students.json');
    // Don't send passwords back
    const safeStudents = students.map(({ password, ...rest }) => rest);
    res.json(safeStudents);
});

// 7. Add Member
app.post('/api/members', (req, res) => {
    const newMember = req.body;
    const students = readData('students.json');
    
    if (students.find(s => s.id === newMember.id)) {
        return res.json({ success: false, message: "Student ID already exists" });
    }

    newMember.password = "pass123"; // Default password
    newMember.date = new Date().toISOString().split('T')[0];
    
    students.push(newMember);
    writeData('students.json', students);
    res.json({ success: true, message: "Member added" });
});

// 8. Issue Book
app.post('/api/issue', (req, res) => {
    const { studentId, isbn } = req.body;
    const books = readData('books.json');
    const issues = readData('issues.json');
    const students = readData('students.json');

    // Validate Student
    const student = students.find(s => s.id === studentId);
    if (!student) {
        return res.json({ success: false, message: "Student ID not found" });
    }

    // Validate Book
    const bookIndex = books.findIndex(b => b.isbn === isbn);
    if (bookIndex === -1) {
        return res.json({ success: false, message: "Book ISBN not found" });
    }
    if (books[bookIndex].available <= 0) {
        return res.json({ success: false, message: "Book is out of stock" });
    }

    // Process Issue
    books[bookIndex].available -= 1;
    writeData('books.json', books);

    const newIssue = {
        id: Date.now(),
        studentId,
        isbn,
        bookTitle: books[bookIndex].title,
        issueDate: new Date().toISOString().split('T')[0],
        status: "Active"
    };
    issues.push(newIssue);
    writeData('issues.json', issues);

    res.json({ success: true, message: "Book issued successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});