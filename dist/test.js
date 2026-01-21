import { createUser, getAllUsers } from "./Models/User";
async function test() {
    try {
        const users = await getAllUsers();
        console.log("Users from DB:", users);
    }
    catch (err) {
        console.error("Error fetching users:", err.message);
    }
}
async function test2() {
    const test = await createUser("t", "DASADASDASDD", "ASDAdsD");
}
test();
test2();
