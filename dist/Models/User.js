//This file will hold the model of the user
import { supabase } from "../Config/supabaseClient.js";
const saltRounds = 10;
export async function createUser(name, password, email) { }
export function updateEmail(id, newEmail, updated_at) { }
export function deleteUser(id) { }
export async function getAllUsers() {
    const { data, error } = await supabase.from("Users").select("*");
    if (error)
        throw error;
    return data;
}
