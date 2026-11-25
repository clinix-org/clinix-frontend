import { TriangleAlert, X } from 'lucide-react';
import type { ToastContentProps } from 'react-toastify';
import { Alert, AlertDescription } from './ui/alert';

type WarningToastData = {
  message: string;
  testId: string;
};

export const WarningToast = ({
  closeToast,
  data,
}: ToastContentProps<WarningToastData>) => (
  <Alert
    role='presentation'
    data-testid={data.testId}
    className='flex min-h-10 items-center gap-2 rounded-md border-amber-500 bg-amber-50 px-3 py-2 text-amber-600'
  >
    <TriangleAlert aria-hidden='true' className='size-4 shrink-0 translate-y-0!' />
    <AlertDescription
      data-testid={`${data.testId}-message`}
      className='min-w-0 flex-1 text-[13px] leading-5 wrap-anywhere text-amber-600'
    >
      {data.message}
    </AlertDescription>
    <button
      type='button'
      onClick={() => closeToast()}
      aria-label='Fechar aviso'
      data-testid={`${data.testId}-close`}
      className='flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
    >
      <X aria-hidden='true' className='size-4' />
    </button>
  </Alert>
);
