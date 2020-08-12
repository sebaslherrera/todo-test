import './App.css';
import React, { useState, useCallback, useEffect } from 'react';

const TODO_URL = 'http://ec2-54-90-206-133.compute-1.amazonaws.com:8000/api/todos/'

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [updateTodo, setUpdateTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const onNewTodoChange = useCallback((event) => {
    setNewTodo(event.target.value)
  }, []);
  const formSubmited = useCallback((event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTodo })
    };

    fetch(TODO_URL, requestOptions)
        .then(response => response.json())
        .then((result) => {
          setTodos([
            ...todos,
            {
              id: result.id,
              content: result.content,
              done: result.done,
            },
          ]);
        });
    setNewTodo(''); // restart input field
  }, [newTodo, todos]);

  const addTodo = useCallback((todo, index) => (event) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done, content: todo.content })
    };

    fetch(`${TODO_URL}${todo.id}/`, requestOptions)
        .then(response => response.json())
        .then((result) => {
          const newTodos = todos.slice();
          newTodos.splice(index, 1, {
            ...todo,
            done: result.done,
            content: result.content
          });
          setTodos(newTodos)
        });
    setUpdateTodo('')
  }, [todos])

  const updateTodoContent = useCallback((todo, index, update) => (event) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: todo.done, content: update })
    };

    fetch(`${TODO_URL}${todo.id}/`, requestOptions)
        .then(response => response.json())
        .then((result) => {
          const newTodos = todos.slice();
          newTodos.splice(index, 1, {
            ...todo,
            done: result.done,
            content: result.content
          });
          setTodos(newTodos)
        });
  }, [todos])

  const onUpdateTodo = (e) => {
    setUpdateTodo(e.target.value)
  }

  const removeTodo = useCallback((todo) => (event) => {    
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
    fetch(`${TODO_URL}${todo.id}/`, requestOptions)
        .then(response => {
          setTodos(todos.filter(otherTodo => otherTodo !== todo));
        })
    
  }, [todos])


  const fetchTodos = () => {
    fetch(TODO_URL).then(res => res.json())
      .then((result) => {
        setTodos(result)        
      }, (error) => {})
  }

  useEffect(() => {
    fetchTodos()
  }, [newTodo]);
  return (
    <div>
      <form onSubmit={formSubmited}>
        <label htmlFor="newTodo">Enter a To-Do:</label>
        <input
          id="newTodo"
          type="text"
          value={newTodo}
          autoFocus
          onChange={onNewTodoChange} />
        <button>Add Todo</button>
      </form>
      {/* <button onClick={markAllDone}>Mark all done</button> */}
      <ul>
        {todos.map((todo, index) => {
          return <li key={todo.id}>
            <input
              value={todo.done}
              type="checkbox"
              checked={todo.done}
              onChange={addTodo(todo, index)}
            />
            <span className={todo.done ? 'done' : ''}>{todo.content}</span>
            <input className={todo.done ? 'done' : ''} onChange={onUpdateTodo} value={updateTodo}/>
            <button onClick={removeTodo(todo)}>Remove Todo</button>
            <button onClick={updateTodoContent(todo, index, updateTodo)}>Update Todo</button>
          </li>
        })}
      </ul>
    </div>
  );
}

export default App;
