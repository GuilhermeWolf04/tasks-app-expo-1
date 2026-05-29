import axios from 'axios';
import React from 'react';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export interface TaskItem {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
}

export const getAllTasks = (setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>, setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  if (setLoading) setLoading(true);
  axios.get<TaskItem[]>(`${baseURL}`).then(({ data }) => {
    setTasks(data);
    if (setLoading) setLoading(false);
  }).catch((err) => {
    console.log(err);
    if (setLoading) setLoading(false);
  });
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/save`, { text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/update`, { _id: taskId, text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(`${baseURL}/delete`, { _id })
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};
