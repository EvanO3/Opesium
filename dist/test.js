import { getAllUsers } from "./Models/User";
async function test() {
    try {
        const users = await getAllUsers();
        console.log("Users from DB:", users);
    }
    catch (err) {
        console.error("Error fetching users:", err.message);
    }
}
test();
