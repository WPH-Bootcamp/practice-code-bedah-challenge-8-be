const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

let users = []; // In-memory storage for users

class User {
  constructor(name, email, password) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = bcrypt.hashSync(password, 10);
    this.createdAt = new Date();
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(name, email, password) {
    const user = new User(name, email, password);
    users.push(user);
    return user;
  }

  static getAll() {
    return users;
  }

  // Method to verify password
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

// Add initial sample users
const sampleUsers = [
  { name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
  { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' },
  { name: 'Alice Brown', email: 'alice@example.com', password: 'password123' },
  { name: 'Charlie Wilson', email: 'charlie@example.com', password: 'password123' },
  { name: 'Diana Davis', email: 'diana@example.com', password: 'password123' },
  { name: 'Edward Miller', email: 'edward@example.com', password: 'password123' },
  { name: 'Fiona Garcia', email: 'fiona@example.com', password: 'password123' },
  { name: 'George Martinez', email: 'george@example.com', password: 'password123' },
  { name: 'Helen Rodriguez', email: 'helen@example.com', password: 'password123' }
];

// Initialize with sample data if empty
if (users.length === 0) {
  sampleUsers.forEach(userData => {
    const user = new User(userData.name, userData.email, userData.password);
    users.push(user);
  });
}

module.exports = User;