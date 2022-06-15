import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import database from "../db/db.js";

import { deleteTodo, createTodo, completeTodo } from "./middlewares.js";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "../templates"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  const tasks = database.data.tasks.filter(
    (todo) => !todo.isCompleted && !todo.isCanceled
  );

  const data = {
    tasks: tasks,
  };

  res.render("index", {
    data: data,
    title: "Taskify - pending tasks",
    path: req.path,
  });
});

app.get("/done-tasks", (req, res) => {
  const completedTodos = database.data.tasks.filter((todo) => todo.isCompleted);
  const data = {
    tasks: completedTodos,
  };
  res.render("index", {
    data: data,
    title: "Taskify - done tasks",
    path: req.path,
  });
});

app.post("/create", createTodo, (req, res) => {
  res.json({ msg: "Created", success: true });
});

app.delete("/delete/:id", deleteTodo, (req, res) => {
  res.json({ msg: "Deleted", success: true });
});

app.put("/complete/:id", completeTodo, (req, res) => {
  res.json({ msg: "Completed", success: true });
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`http://localhost:${PORT}/`);
});
