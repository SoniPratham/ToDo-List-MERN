const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const cors = require('cors');

const app = express();
const PORT = 3001;
const MONGODB_URI = 'mongodb+srv://soni:xyz@todolist.gy1uelq.mongodb.net/test';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useFindAndModify: false,
//   // useCreateIndex: true
  
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.log(err);
// });

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("Error connecting DB!"+err));

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ position: 'asc' });
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title, link } = req.body;
  const todo = new Todo({
    title,
    link,
    position: await Todo.countDocuments() + 1
  });
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { checked } = req.body;
  const todo = await Todo.findByIdAndUpdate(id, { checked }, { new: true });
  res.json(todo);
});

app.post('/api/todos/reorders', async (req, res) => {
  try {
    const { todos } = req.body;
    console.log(req.body)
    await Promise.all(todos.map(async (todo, index) => {
      console.log(index + 1)
      console.log(" nkjcnskjncks ")
      console.log(todo._id)
      await Todo.findByIdAndUpdate(todo._id, { position: index + 1 });
    }));
    res.json({ message: 'Reordered todos' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
