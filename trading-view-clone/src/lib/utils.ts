// Utility function to concatenate class names conditionally
export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}