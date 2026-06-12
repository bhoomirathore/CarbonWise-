import React from 'react';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  size = 'default',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-(screen-2xl)'
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
