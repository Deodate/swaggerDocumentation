const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const port = 3600;

// Middleware to parse JSON requests
app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample greeting route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample data (simulating a database)
let users = [
  { id: 1, name: 'Deodate' },
  { id: 2, name: 'Mugenzi' },
];

// CRUD operations
// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Create a new user
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user by ID
app.put('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  let updated = false;
  users = users.map(user => {
    if (user.id === userId) {
      user.name = req.body.name;
      updated = true;
    }
    return user;
  });
  if (updated) {
    res.json({ id: userId, name: req.body.name });
  } else {
    res.status(404).send('User not found');
  }
});

// Delete a user by ID
app.delete('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const initialLength = users.length;
  users = users.filter(user => user.id !== userId);
  if (users.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
