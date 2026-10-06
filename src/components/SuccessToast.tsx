import { Check, X } from 'lucide-react';
import type { ToastContentProps } from 'react-toastify';
import { Alert, AlertDescription } from './ui/alert';

type SuccessToastData = {
  message: string;
};

export const SuccessToast = ({
  closeToast,
  data,
}: ToastContentProps<SuccessToastData>) => (
  <Alert
    role='presentation'
    className='flex min-h-12 items-center gap-3 rounded-md border-ui-button bg-green-100 px-3 py-2 text-green-700'
  >
    <Check aria-hidden='true' className='size-4 shrink-0 translate-y-0!' />
    <AlertDescription className='min-w-0 flex-1 text-[13px] leading-5 wrap-anywhere text-green-700'>
      {data.message}
    </AlertDescription>
    <button
      type='button'
      onClick={() => closeToast()}
      aria-label='Fechar notificação'
      className='flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-green-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'
    >
      <X aria-hidden='true' className='size-4' />
    </button>
  </Alert>
);
