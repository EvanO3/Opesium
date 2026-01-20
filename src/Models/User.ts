//This file will hold the model of the user

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function createUser(email: string) {}
export function updateEmail(id: string, newEmail: string, updated_at: string) {}
export function deleteUser(id: string) {}

module.exports = { createUser, updateEmail, deleteUser };
