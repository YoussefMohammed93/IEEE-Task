"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const TodoApp = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      name: task,
      completed: false,
    };

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });

    setTask("");
  };

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((taskItem) =>
        taskItem.id === id
          ? { ...taskItem, completed: !taskItem.completed }
          : taskItem
      );
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const handleRemoveTask = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((taskItem) => taskItem.id !== id);
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  return (
    <div className="w-full max-w-md mx-auto border shadow-sm rounded-lg p-5 bg-white">
      <h1 className="text-center text-2xl font-bold mb-5">Todo List</h1>
      <form onSubmit={handleAddTask} className="w-full mb-5">
        <Input
          type="text"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Enter task name"
          className="transition duration-300"
        />
        <Button type="submit" className="w-full mt-5 transition duration-300">
          Add Task
          <Plus />
        </Button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={cn("flex items-center justify-between py-3", {
              "border-b": tasks.length > 1,
            })}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                className="size-6 mr-3"
              />
              <span
                className={`${
                  task.completed ? "line-through text-gray-500" : "text-black"
                }`}
              >
                {task.name}
              </span>
            </div>
            <Button
              onClick={() => handleRemoveTask(task.id)}
              variant="destructive"
              className="transition duration-300"
            >
              Remove
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
