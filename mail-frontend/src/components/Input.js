import React, { useState } from 'react'

const Input = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    isRequired = false,
    className = '',
    value,
    onChange,
    hasError = false,
    errorMessage = '',
    disabled = false,
    leftIcon = null,
    rightIcon = null,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`flex flex-col gap-1.5 w-full group ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ml-1 ${hasError
                            ? 'text-red-500'
                            : isFocused
                                ? 'text-primary'
                                : 'text-gray-500'
                        }`}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-3.5 
                        bg-gray-50 
                        border-2 
                        rounded-xl 
                        text-gray-900 
                        text-base 
                        transition-all 
                        duration-300 
                        outline-none 
                        placeholder:text-gray-400
                        disabled:bg-gray-100 
                        disabled:cursor-not-allowed
                        ${leftIcon ? 'pl-12' : ''}
                        ${rightIcon || isPassword ? 'pr-12' : ''}
                        ${hasError
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : isFocused
                                ? 'border-primary bg-white ring-4 ring-primary/10 shadow-lg shadow-primary/5'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }
                    `}
                    placeholder={placeholder}
                    required={isRequired}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                )}
                {rightIcon && !isPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {hasError && errorMessage && (
                <p className="text-red-500 text-sm mt-0.5 ml-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                </p>
            )}
        </div>
    )
}

export default Input