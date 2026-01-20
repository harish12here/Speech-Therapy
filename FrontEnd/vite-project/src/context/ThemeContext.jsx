import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            return JSON.parse(savedTheme);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update local storage
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        
        // Update document class on html element
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        if (darkMode) {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark');
        }
        
        // Also update the color-scheme meta
        const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
        if (metaColorScheme) {
            metaColorScheme.setAttribute('content', darkMode ? 'dark' : 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
