const { v4: uuidv4 } = require('uuid');

let todos = []; // In-memory storage for todos

class Todo {
  constructor(task, priority, date, userId) {
    this.id = uuidv4();
    this.task = task;
    this.priority = priority; // 'low', 'medium', 'high'
    this.date = new Date(date);
    this.completed = false;
    this.userId = userId;
    this.createdAt = new Date();
  }

  static create(task, priority, date, userId) {
    const todo = new Todo(task, priority, date, userId);
    todos.push(todo);
    return todo;
  }

  static findByUserId(userId) {
    return todos.filter(todo => todo.userId === userId);
  }

  static findById(id) {
    return todos.find(todo => todo.id === id);
  }

  static update(id, updates) {
    const todo = this.findById(id);
    if (todo) {
      Object.assign(todo, updates);
      return todo;
    }
    return null;
  }

  static delete(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      return todos.splice(index, 1)[0];
    }
    return null;
  }

  static getAll() {
    return todos;
  }

  // Method to seed initial data
  static seedInitialData(users) {
    if (todos.length === 0 && users.length > 0) {
      const sampleTodos = [
        // Today's todos
        { task: 'Complete project documentation', priority: 'high', date: new Date().toISOString().split('T')[0], completed: false },
        { task: 'Review code changes', priority: 'medium', date: new Date().toISOString().split('T')[0], completed: false },
        { task: 'Update dependencies', priority: 'low', date: new Date().toISOString().split('T')[0], completed: true },
        { task: 'Fix authentication bug', priority: 'high', date: new Date().toISOString().split('T')[0], completed: false },
        { task: 'Write unit tests', priority: 'medium', date: new Date().toISOString().split('T')[0], completed: true },

        // Tomorrow's todos
        { task: 'Prepare presentation slides', priority: 'high', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
        { task: 'Schedule team meeting', priority: 'medium', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
        { task: 'Backup database', priority: 'low', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },
        { task: 'Optimize database queries', priority: 'medium', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], completed: false },

        // Future todos
        { task: 'Plan next sprint', priority: 'high', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], completed: false },
        { task: 'Research new technologies', priority: 'medium', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], completed: false },
        { task: 'Update security policies', priority: 'high', date: new Date(Date.now() + 259200000).toISOString().split('T')[0], completed: false },
        { task: 'Conduct performance audit', priority: 'medium', date: new Date(Date.now() + 259200000).toISOString().split('T')[0], completed: false },
        { task: 'Train new team members', priority: 'low', date: new Date(Date.now() + 345600000).toISOString().split('T')[0], completed: false },

        // Completed todos from past
        { task: 'Setup development environment', priority: 'high', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], completed: true },
        { task: 'Create initial project structure', priority: 'high', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], completed: true },
        { task: 'Implement user authentication', priority: 'high', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], completed: true },
        { task: 'Design database schema', priority: 'medium', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], completed: true },
        { task: 'Setup CI/CD pipeline', priority: 'medium', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], completed: true },
        { task: 'Write API documentation', priority: 'low', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], completed: true },
        { task: 'Configure monitoring tools', priority: 'low', date: new Date(Date.now() - 345600000).toISOString().split('T')[0], completed: true },

        // More sample todos
        { task: 'Refactor legacy code', priority: 'medium', date: new Date(Date.now() + 432000000).toISOString().split('T')[0], completed: false },
        { task: 'Implement caching layer', priority: 'high', date: new Date(Date.now() + 432000000).toISOString().split('T')[0], completed: false },
        { task: 'Create user dashboard', priority: 'medium', date: new Date(Date.now() + 518400000).toISOString().split('T')[0], completed: false },
        { task: 'Setup logging system', priority: 'low', date: new Date(Date.now() + 518400000).toISOString().split('T')[0], completed: false },
        { task: 'Implement rate limiting', priority: 'medium', date: new Date(Date.now() + 604800000).toISOString().split('T')[0], completed: false },
        { task: 'Create admin panel', priority: 'high', date: new Date(Date.now() + 604800000).toISOString().split('T')[0], completed: false },
        { task: 'Setup automated testing', priority: 'medium', date: new Date(Date.now() + 691200000).toISOString().split('T')[0], completed: false },
        { task: 'Optimize frontend performance', priority: 'low', date: new Date(Date.now() + 691200000).toISOString().split('T')[0], completed: false },
        { task: 'Implement dark mode', priority: 'low', date: new Date(Date.now() + 777600000).toISOString().split('T')[0], completed: false },
        { task: 'Add multi-language support', priority: 'medium', date: new Date(Date.now() + 777600000).toISOString().split('T')[0], completed: false },
        { task: 'Setup email notifications', priority: 'low', date: new Date(Date.now() + 864000000).toISOString().split('T')[0], completed: false },
        { task: 'Create user onboarding flow', priority: 'medium', date: new Date(Date.now() + 864000000).toISOString().split('T')[0], completed: false },
        { task: 'Implement file upload feature', priority: 'high', date: new Date(Date.now() + 950400000).toISOString().split('T')[0], completed: false },
        { task: 'Add data export functionality', priority: 'medium', date: new Date(Date.now() + 950400000).toISOString().split('T')[0], completed: false },
        { task: 'Setup analytics tracking', priority: 'low', date: new Date(Date.now() + 1036800000).toISOString().split('T')[0], completed: false }
      ];

      // Distribute todos among users
      sampleTodos.forEach((todoData, index) => {
        const userIndex = index % users.length;
        const user = users[userIndex];
        const todo = new Todo(todoData.task, todoData.priority, todoData.date, user.id);
        todo.completed = todoData.completed;
        todos.push(todo);
      });
    }
  }
}

module.exports = Todo;