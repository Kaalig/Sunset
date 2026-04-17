import { getHabits } from "./api.js";

export async function displayHabits() {
    const habits = await getHabits();
    console.log(habits);
}

displayHabits();