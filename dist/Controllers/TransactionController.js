import { addTransaction } from "../Models/TransactionModel.js";
export const CreateTransaction = async (req, res) => {
    try {
        const { user_id, categoryName, amount, description } = req.body;
        await addTransaction(user_id, categoryName, amount, description);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error: ", error });
    }
};
