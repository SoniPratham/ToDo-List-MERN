const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
