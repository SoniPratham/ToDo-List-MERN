import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/todos').then(res => {
      setTodos(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  const addTodo = (title, link) => {
    axios.post('http://localhost:3001/api/todos', { title, link }).then(res => {
      setTodos([...todos, res.data]);
    }).catch
      (err => {
        console.log(err);
      });
  };

  const toggleChecked = (id, checked) => {
    axios.put(`http://localhost:3001/api/todos/${id}`, { checked }).then(res => {
      const updatedTodos = todos.map(todo => {
        if (todo._id === res.data._id) {
          return res.data;
        } else {
          return todo;
        }
      });
      setTodos(updatedTodos);
    }).catch(err => {
      console.log(err);
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
    axios.post('http://localhost:3001/api/todos/reorders', { todos: items }).then(res => {

    }).catch(err => {
      console.log(err);
    });

  };

  return (
    <Card className="text-center" style={{ width: '50%', height: '50%', margin: 'auto' }}>
      <Card.Header><h2 className="text-center">To-Do List</h2></Card.Header>
      <Card.Body>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const title = e.target.elements.title.value;
        const link = e.target.elements.link.value;
        addTodo(title, link);
        e.target.reset();
      }} className="mb-3">
        <div className="row">
          <div className="col-sm-4">
            <input type="text" name="title" className="form-control" placeholder="Title" required />
          </div>
          <br />
          <div className="col-sm-4">
            <input type="text" name="link" className="form-control" placeholder="Description" required />
          </div>
          <br />
          <div className="col-sm-4">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
          <br />
        </div>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ul">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="list-group">
              {todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`todo-${todo._id}`} checked={todo.checked} onChange={(e) => toggleChecked(todo._id, e.target.checked)} />
                        <label style={{ textDecoration: todo.checked ? 'line-through' : 'none' }} className="form-check-label" htmlFor={`todo-${todo._id}`}>
                          {todo.title + " : " + todo.link}
                        </label>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext> 
      </Card.Body>
    <Card.Footer className="text-muted">© Copyright 2023 Todo List</Card.Footer>
    </Card>
  );
}

export default App;