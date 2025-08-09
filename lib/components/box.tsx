'use client'
import { BoxProps } from '../interfaces'

export default function Box({children, className, ...props}: BoxProps) {
    return (
        <div
            {...props}
            className={`p-4 md:p-8 bg-neutral-900 rounded-lg my-4 ${className || ''}`}
        >
            {children}
        </div>
    );
}