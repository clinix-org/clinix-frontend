import { useState } from 'react';
import { isAxiosError } from 'axios';
import logo from '../assets/logo-clinix.svg';
import * as z from 'zod';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, TriangleAlert } from 'lucide-react';

const Login = () => {
  const { login, logout } = useAuth();
  const location = useLocation();
  const state = location.state as {
    from?: string;
    sessionExpired?: boolean;
  } | null;

  const schema = z.object({
    username: z.string().min(1, 'Campo obrigatório').email('Email inválido'),
    password: z.string().min(6, 'Campo obrigatório'),
  });

  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isEmailAlertDismissed, setIsEmailAlertDismissed] = useState(false);

  const isFormValid = schema.safeParse(formState).success;
  const hasInvalidEmail =
    isEmailTouched &&
    !schema.shape.username.safeParse(formState.username).success;
  const showEmailAlert = hasInvalidEmail && !isEmailAlertDismissed;

  const handleSubmit = async () => {
    if (isLoading) return;

    setHasInvalidCredentials(false);
    setIsEmailTouched(true);
    setIsEmailAlertDismissed(false);
    if (!isFormValid) {
      return;
    }

    logout();

    try {
      setIsLoading(true);
      const token = await authService.login(
        formState.username.trim(),
        formState.password.trim(),
      );

      await login(token, state?.from);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setHasInvalidCredentials(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-[458px] bg-white shadow-xl rounded-lg p-8'>
        <div className='flex flex-col items-center mb-4'>
          <img src={logo} alt='Clinix Logo' className='w-40 mb-2' />
          <h2 className='text-2xl font-bold text-[#001E2B] mt-4'>
            Acessar o sistema
          </h2>
          {state?.sessionExpired === true && (
            <Alert className='border-yellow-500 bg-yellow-50 text-yellow-700 mt-5'>
              <TriangleAlert className='size-4' />
              <AlertDescription className='text-yellow-700'>
                Sua sessão expirou. Faça login novamente.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <form className='flex flex-col gap-4'>
          {hasInvalidCredentials && (
            <Alert
              variant='destructive'
              className='border-red-500 bg-red-50 text-red-700'
            >
              <CircleAlert className='size-4' />
              <AlertDescription className='text-red-700'>
                E-mail ou senha incorretos. Tente novamente.
              </AlertDescription>
            </Alert>
          )}
          {showEmailAlert && (
            <Alert className='relative border-yellow-600 bg-yellow-50 py-3 pr-10 text-yellow-700'>
              <TriangleAlert className='size-4' aria-hidden='true' />
              <AlertDescription id='email-error' className='text-yellow-700'>
                Preencha o campo selecionado corretamente.
              </AlertDescription>
            </Alert>
          )}
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='font-bold text-sm text-[#001E2B]'>
              E-mail
            </label>
            <input
              className={`w-full border rounded-md px-4 py-3 placeholder:text-gray-400 focus:outline-none transition-colors ${
                hasInvalidEmail
                  ? 'border-yellow-600 focus:border-yellow-600'
                  : 'border-gray-200 focus:border-ui-button'
              }`}
              type='email'
              placeholder='clinix@clinix.com'
              name='email'
              id='email'
              aria-invalid={hasInvalidEmail}
              aria-describedby={showEmailAlert ? 'email-error' : undefined}
              onBlur={() => {
                setIsEmailTouched(true);
                setIsEmailAlertDismissed(false);
              }}
              onChange={e =>
                setFormState({ ...formState, username: e.target.value })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='password'
              className='font-bold text-sm text-[#001E2B]'
            >
              Senha
            </label>
            <input
              className='w-full border border-gray-200 rounded-md px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-ui-button transition-colors'
              type='password'
              placeholder='******'
              name='password'
              id='password'
              onChange={e =>
                setFormState({ ...formState, password: e.target.value })
              }
            />
          </div>

          <div className='flex justify-end'>
            <a
              href='#'
              className='text-gray-500 font-bold text-sm hover:underline'
            >
              Esqueci a senha
            </a>
          </div>

          <button
            type='button'
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 mt-4 font-bold rounded-md transition-colors cursor-pointer uppercase tracking-wide
                            ${
                              isFormValid
                                ? 'bg-ui-button text-white hover:bg-[#0a8c55]'
                                : 'bg-[#D1FAE5] text-[#065F46] cursor-not-allowed hover:bg-[#D1FAE5]'
                            }`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
