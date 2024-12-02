export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get the date part only
}