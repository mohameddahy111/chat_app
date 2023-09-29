import { Server } from "socket.io";
import express from "express";
import connect from "./db/connect.js";
import dotenv from "dotenv";
import Task from "./tasks/task.schema.js";

dotenv.config();
const app = express();
const port = 5001;

connect();
const server = app.listen(port, () => {
  console.log(`http://localhost/${port}`);
});

const io = new Server(server, { cors: "*" });
const getAll = async () => {
  const data = await Task.find();
  return data;
};
io.on("connection", async (socket) => {
  const allTask = await getAll();
  socket.emit( 'getData' ,allTask);

  socket.on("newTask", async (task) => {
    await Task.insertMany(task);
    const allTask = await getAll();
    socket.emit("all", allTask);
  });
  socket.on("deleleItem", async (deleleItem) => {
    await Task.findByIdAndDelete(deleleItem);
    const allTaskD = await getAll();
    socket.emit("deleleItemDone", allTaskD);
  });
  socket.on("findItem", async (id) => {
    const item = await Task.findById(id);
    socket.emit("item", item);
  });
  socket.on("eidtTask", async (task) => {
    const findTask = await Task.findByIdAndUpdate(task.id, {
      title: task.title,
      task: task.task,
    } , {new:true});
    const allTaskD = await getAll();
    socket.emit('eidtTaskDone', allTaskD);
  });
});
