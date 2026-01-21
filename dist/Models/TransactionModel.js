import { supabase } from "../Config/supabaseClient.js";
export async function addTransaction(user_id, categoryName, amount, description) {
    const { data: categoryData, error: categoryError } = await supabase
        .from("Category")
        .select("id")
        .eq("name", categoryName)
        .single();
    if (categoryError)
        return { error: "Category not found" };
    const { data, error } = await supabase.from("Transaction").insert([
        {
            user_id,
            category_id: categoryData.id,
            amount,
            description,
            date: new Date(),
            created_at: new Date(),
        },
    ]);
    return data;
}
