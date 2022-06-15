import { nanoid } from "nanoid";
import database from "../db/db.js";

const getTime = () => {
  return `${new Date()}`.split(" ").slice(0, 5).join(" ");
};

const createTodo = (req, res, next) => {
  const { title, task } = req.body;
  if (title.trim() === "" || task.trim() === "") {
    return;
  }
  const id = nanoid();
  const newTodo = {
    id: id,
    title: title,
    task: task,
    createdTime: getTime(),
    completedTime: null,
    isCanceled: false,
    isCompleted: false,
    isEdited: false,
    finishedTime: null,
  };
  database.data.tasks.push(newTodo);
  database.write();
  next();
};

const completeTodo = (req, res, next) => {
  const completeByID = req.params.id;
  const todo = database.data.tasks.find((todo) => todo.id === completeByID);
  todo.isCompleted = true;
  todo.isCanceled = false;
  todo.completedTime = getTime();
  database.write();
  next();
};

const deleteTodo = (req, res, next) => {
  const id = req.params.id;
  database.data.tasks = database.data.tasks.filter((todo) => todo.id !== id);
  database.write();
  next();
};

export { deleteTodo, createTodo, completeTodo };
