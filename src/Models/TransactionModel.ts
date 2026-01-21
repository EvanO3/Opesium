import { supabase } from "../Config/supabaseClient.ts";

export async function addTransaction(
  user_id: string,
  categoryName: string,
  amount: Number,
  description: string,
) {
  const { data: categoryData, error: categoryError } = await supabase
    .from("Category")
    .select("id")
    .eq("name", categoryName)
    .single();

  if (categoryData) {
    console.log("Found");
  }
  
  if (categoryError) {
    console.log(categoryError);
    return { error: "Category not found" };
  }
  const amountNumber = Number(amount);

  const { data, error } = await supabase.from("Transaction").insert([
    {
      user_id,
      amount: amountNumber,
      category_id: categoryData.id,
      description,
      date: new Date(),
      created_at: new Date(),
    },
  ]);
  console.log(categoryData.id);
  console.log(data);

  if (error) {
    console.log(error);
    return { error: "Error inserting data" };
  }

  return data;
}
