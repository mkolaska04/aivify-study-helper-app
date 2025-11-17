"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"


export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(raf);
    }, [])


    if (!mounted) return null

    return (
        <select
            onChange={(e) => setTheme(e.target.value)}
            value={resolvedTheme}
            className="select select-bordered select-sm w-full max-w-xs bg-surface border-outline text-text text-body_md py-2"
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    )
}