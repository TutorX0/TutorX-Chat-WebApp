export function readableTime(dateString: string) {
    const date = new Date(dateString);

    const hoursAndMinutes = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return hoursAndMinutes;
}
