import React from 'react';

interface SwitchProps {
    id?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

export function Switch({ id, checked, onCheckedChange, className = '' }: SwitchProps) {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`
                relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${checked ? 'bg-primary dark:bg-primary' : 'bg-muted dark:bg-muted'}
                ${className}
            `}
        >
            <span
                className={`
                    pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background dark:bg-background shadow-sm
                    transition duration-200 ease-in-out
                    ${checked ? 'translate-x-4' : 'translate-x-0'}
                `}
            />
        </button>
    );
} 