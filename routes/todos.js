const express = require('express');
const Todo = require('../models/Todo');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All todo routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - priority
 *               - date
 *             properties:
 *               task:
 *                 type: string
 *                 description: Todo task description
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Todo priority level
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Todo due date (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     task:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     date:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Create todo
router.post('/', (req, res) => {
  try {
    const { task, priority, date } = req.body;
    const userId = req.user.id;

    // Validation
    if (!task || !priority || !date) {
      return res.status(400).json({ message: 'Task, priority, and date are required' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    // Validate date
    const todoDate = new Date(date);
    if (isNaN(todoDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const todo = Todo.create(task, priority, date, userId);

    res.status(201).json({
      message: 'Todo created successfully',
      todo: {
        id: todo.id,
        task: todo.task,
        priority: todo.priority,
        date: todo.date,
        completed: todo.completed,
        createdAt: todo.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to get today's date
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Helper function to get tomorrow
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

/**
 * @swagger
 * /todos/today:
 *   get:
 *     summary: Get today's todos
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: task
 *         schema:
 *           type: string
 *         description: Filter by task name (partial match)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: List of today's todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       task:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       date:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// List today's todos with pagination and filters
router.get('/today', (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, task, priority } = req.query;

    let todos = Todo.findByUserId(userId).filter(todo => {
      const today = getToday();
      const tomorrow = getTomorrow();
      return todo.date >= today && todo.date < tomorrow && !todo.completed;
    });

    // Apply filters
    if (task) {
      todos = todos.filter(todo => todo.task.toLowerCase().includes(task.toLowerCase()));
    }
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTodos = todos.slice(startIndex, endIndex);

    res.json({
      todos: paginatedTodos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: todos.length,
        pages: Math.ceil(todos.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /todos/upcoming:
 *   get:
 *     summary: Get upcoming todos
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: task
 *         schema:
 *           type: string
 *         description: Filter by task name (partial match)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of upcoming todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       task:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       date:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// List upcoming todos with pagination and filters
router.get('/upcoming', (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, task, priority, date } = req.query;

    let todos = Todo.findByUserId(userId).filter(todo => {
      const tomorrow = getTomorrow();
      return todo.date >= tomorrow && !todo.completed;
    });

    // Apply filters
    if (task) {
      todos = todos.filter(todo => todo.task.toLowerCase().includes(task.toLowerCase()));
    }
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }
    if (date) {
      const filterDate = new Date(date);
      todos = todos.filter(todo => todo.date.toDateString() === filterDate.toDateString());
    }

    // Sort by date
    todos.sort((a, b) => a.date - b.date);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTodos = todos.slice(startIndex, endIndex);

    res.json({
      todos: paginatedTodos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: todos.length,
        pages: Math.ceil(todos.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /todos/completed:
 *   get:
 *     summary: Get completed todos
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: task
 *         schema:
 *           type: string
 *         description: Filter by task name (partial match)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: List of completed todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       task:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       date:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// List completed todos with pagination and filters
router.get('/completed', (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, task, priority } = req.query;

    let todos = Todo.findByUserId(userId).filter(todo => todo.completed);

    // Apply filters
    if (task) {
      todos = todos.filter(todo => todo.task.toLowerCase().includes(task.toLowerCase()));
    }
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }

    // Sort by completion date (assuming we add completedAt later, for now sort by createdAt desc)
    todos.sort((a, b) => b.createdAt - a.createdAt);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTodos = todos.slice(startIndex, endIndex);

    res.json({
      todos: paginatedTodos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: todos.length,
        pages: Math.ceil(todos.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;