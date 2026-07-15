type StatusTone = 'success' | 'danger' | 'warning' | 'neutral';

type StatusPillProps = {
  children: string;
  tone?: StatusTone;
  minWidthClassName?: string;
};

const toneClasses: Record<StatusTone, { badge: string; dot: string }> = {
  success: {
    badge: 'bg-[#dff8ed] text-[#0cad69]',
    dot: 'bg-[#0cad69]',
  },
  danger: {
    badge: 'bg-[#ffdfe5] text-[#c43b4c]',
    dot: 'bg-[#c43b4c]',
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  neutral: {
    badge: 'bg-[#f4f4f4] text-[#646b72]',
    dot: 'bg-[#82878c]',
  },
};

export const StatusPill = ({
  children,
  tone = 'neutral',
  minWidthClassName = 'min-w-[auto]',
}: StatusPillProps) => (
  <span
    className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ${minWidthClassName} ${toneClasses[tone].badge}`}
  >
    <span className={`size-2 rounded-full ${toneClasses[tone].dot}`} />
    {children}
  </span>
);

export const OutlinePill = ({ children }: { children: string }) => {
  const bgStatusAdmin: string = children === 'ADMIN' ? 'bg-[#0000000D]' : '';

  return (
    <span
      className={`inline-flex min-w-22 items-center justify-center rounded-full border-2 border-[#cfd3d6] ${bgStatusAdmin} px-3 py-1 text-[11px] font-medium text-[#3f454a]`}
    >
      {children === 'USER' ? 'Colaborador' : 'Administrador'}
    </span>
  );
};
