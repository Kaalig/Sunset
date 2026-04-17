export async function getHabits() {
    const response = await fetch('/api/habits');
    return await response.json();
}