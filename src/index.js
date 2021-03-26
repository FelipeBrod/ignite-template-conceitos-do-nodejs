const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  console.log(username);
  const user = users.find((e) => e.userName == username);

  if (!user) {
    return response.status(400).json({
      error: "User not found",
    });
  }
  request.user = user;
  return next();
}

app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

app.post("/users", (request, response) => {
  const { name, userName, todos } = request.body;

  const userAlreadyExists = users.some((e) => e.userName === userName);

  if (userAlreadyExists) {
    return response
      .status(400)
      .json({ error: "User already exists" })
      .send(users);
  }

  users.push({
    name,
    userName,
    id: uuidv4(),
    todos,
  });

  return response.sendStatus(201).send(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { todo } = request.body;
  const { user } = request;

  user.todos.push(...todo);

  response.status(201).json(user.todos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
