//This file will hold the model of the user
import { supabase } from "../Config/supabaseClient.ts";

export function createUser(email: string) {}
export function updateEmail(id: string, newEmail: string, updated_at: string) {}
export function deleteUser(id: string) {}

export async function getAllUsers() {
  const { data, error } = await supabase.from("user").select("*");
  if (error) throw error;
  return data;
}
