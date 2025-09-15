export function whatsappTime(dateInput: string | number | Date) {
    const date = new Date(dateInput);

    // Get today's UTC midnight
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const targetUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInDays = (todayUTC - targetUTC) / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) {
        // Today → show time
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (diffInDays === 1) {
        return "Yesterday";
    }

    if (diffInDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" }); // Mon, Tue...
    }

    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}
