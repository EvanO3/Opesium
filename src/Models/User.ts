//This file will hold the model of the user
import { supabase } from "../Config/supabaseClient.ts";
const saltRounds = 10;

export async function createUser(
  name: string,
  password: string,
  email: string,
) {}
export function updateEmail(id: string, newEmail: string, updated_at: string) {}
export function deleteUser(id: string) {}

export async function getAllUsers() {
  const { data, error } = await supabase.from("Users").select("*");
  if (error) throw error;
  return data;
}
