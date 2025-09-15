export function whatsappTime(dateInput: string | number | Date) {
    const date = new Date(dateInput);
    const now = new Date();

    // Strip time → local midnight
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInMs = startOfToday.getTime() - startOfTarget.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

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
        // Within the last week → weekday
        return date.toLocaleDateString([], { weekday: "short" }); // e.g. Mon
    }

    // Older → show full date
    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}
