import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ToDoList from './ToDoList';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToDoList />
  </React.StrictMode>
);

reportWebVitals();
