import React from 'react'

const Button = ({ 
    label, 
    type = 'button',
    onClick, 
    className = '',
    disabled = false, 
    variant = 'primary',
    size = 'medium',
    loading = false,
}) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none overflow-hidden';
    
    const variants = {
        primary: `bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] focus:ring-primary`,
        secondary: `bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-gray-500`,
        outline: `bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] focus:ring-primary`,
        ghost: `bg-transparent text-primary hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] focus:ring-primary`,
    };
    
    const sizes = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };

    const buttonContent = (
        <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {label}
        </span>
    );

    const loadingSpinner = loading && (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
        >
            {buttonContent}
            {loadingSpinner}
        </button>
    )
}

export default Button