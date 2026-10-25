"use client";

import { useEffect, useState } from "react";

export default function TodayDate() {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            })
        );
    }, []);

    return <>{today ? `${today} · ` : ""}</>;
}