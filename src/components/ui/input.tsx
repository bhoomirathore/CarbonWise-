import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-base text-foreground transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-error focus:ring-error focus:border-error' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-error font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
};
