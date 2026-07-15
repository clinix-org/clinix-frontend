import type { ReactNode } from 'react';

type PageSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export const PageSurface = ({ children, className = '' }: PageSurfaceProps) => (
  <section
    className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-lg rounded-tr-lg bg-white ${className}`}
  >
    {children}
  </section>
);
