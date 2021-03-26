const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const e = require("express");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  //console.log(username);
  const user = users.find((e) => e.username == username);

  if (!user) {
    return response.status(404).json({
      error: "User not found",
    });
  }
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find((e) => e.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

function findATodo(user, todoId) {
  const todo = user.todos.find((e) => e.id === todoId);

  return todo;
}

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  console.log(title);

  const todoOp = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todoOp);

  response.status(201).json(todoOp);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = findATodo(user, id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found" });
  }
  todo.title = title;
  todo.deadline = deadline;

  response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = findATodo(user, id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found" });
  }
  todo.done = true;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const oldTodoIndex = user.todos.findIndex((e) => e.id === id); //returns the pos of the object

  if (oldTodoIndex === -1) {
    return response.status(404).json({ error: "todo not found" });
  }

  user.todos.splice(oldTodoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
