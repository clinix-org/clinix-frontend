import type { ReactNode } from "react";

interface PageShellProps {
    title: string;
    children: ReactNode;
    action?: ReactNode;
}

export const PageShell = ({ title, children, action }: PageShellProps) => {
    return (
        <div className="flex min-h-full flex-col bg-[#f8fafc]">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
                <h1 className="text-[13px] font-medium uppercase tracking-wide text-gray-400">
                    {title}
                </h1>
                {action}
            </div>

            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
};
