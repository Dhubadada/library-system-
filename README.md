# 📚 Library Management System (LMS)

<img width="759" height="579" alt="image" src="https://github.com/user-attachments/assets/577b12e2-ba10-403e-88df-ea2900dad345" />

A lightweight, fully functional Library Management System built with **Node.js** and **Vanilla JavaScript**. It uses a JSON-based storage system (no external database required) to manage books, students, and borrowing records.

## 📸 Screenshots

### Admin Dashboard & Statistics
<img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/480a5287-2876-426c-8877-bf355703755e" />

### Book Catalog & Management
![WhatsApp Image 2025-12-15 at 19 56 58_3fd27850](https://github.com/user-attachments/assets/c1910433-1225-4738-b14d-65a345cb247a)

## 🚀 Features

### 🛡️ Admin Panel
- **Secure Login:** Authenticated access for library administrators.
- **Dashboard Stats:** Real-time view of total books, registered members, and issued books.
- **Book Management:** Add new books with ISBN, author, and quantity. Delete outdated books.
- **Member Management:** View and register new student members.
- **Issue System:** Issue books to students with stock validation.

### 🎓 Student Panel
- **Student Login:** Personalized access for students.
- **Book Search:** Browse the library catalog and check real-time availability.
- **Dashboard:** View library announcements and status.

### ⚙️ Backend Architecture
- **REST API:** Built with Express.js to handle data requests.
- **JSON Database:** Uses the native `fs` module to read/write data to local JSON files (`books.json`, `students.json`, etc.).
- **Self-Healing:** Automatically generates the `data` folder and default admin credentials if they don't exist.
- **CORS Enabled:** Allows secure communication between the frontend and backend.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** Local JSON file storage.
- **Role	Username / ID	Password
Admin	admin@lms.edu	123
Student	233016112	pass123
*********************************************************************************************
