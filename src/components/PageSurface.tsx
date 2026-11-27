import type { ReactNode } from 'react';

type PageSurfaceProps = {
  children: ReactNode;
  testId?: string;
  className?: string;
};

export const PageSurface = ({ children, className = '', testId }: PageSurfaceProps) => (
  <section
    data-testid={testId}
    className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-lg rounded-tr-lg bg-white ${className}`}
  >
    {children}
  </section>
);
