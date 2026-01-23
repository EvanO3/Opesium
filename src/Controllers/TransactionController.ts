import { addTransaction } from "../Models/TransactionModel.ts";
import express from "express";
import type { Request, Response } from "express";

export const CreateTransaction = async (req: Request, res: Response) => {
  try {
    const { categoryName, amount, description } = req.body;
    await addTransaction(categoryName, amount, description);
    return res.status(200).json({ message: "successful transaction" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error: ", error });
  }
};
