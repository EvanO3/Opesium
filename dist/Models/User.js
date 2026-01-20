//This file will hold the model of the user
import { supabase } from "../Config/supabaseClient";
export function createUser(email) { }
export function updateEmail(id, newEmail, updated_at) { }
export function deleteUser(id) { }
export async function getAllUsers() {
    const { data, error } = await supabase.from("user").select("*");
    if (error)
        throw error;
    return data;
}
