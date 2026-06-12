import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'default' | 'surface' | 'dark' | 'muted';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'default',
  ...props
}) => {
  const bgClasses = {
    default: 'bg-background',
    surface: 'bg-white border-y border-border',
    dark: 'bg-primary text-white',
    muted: 'bg-slate-100 border-y border-border'
  };

  return (
    <section
      className={`py-12 md:py-20 ${bgClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};
