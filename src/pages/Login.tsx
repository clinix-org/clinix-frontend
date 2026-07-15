import { useState } from 'react';
import { isAxiosError } from 'axios';
import logo from '../assets/logo-clinix.svg';
import * as z from 'zod';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { authService } from '../services/authService';

const Login = () => {
  const { login, logout } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: string; sessionExpired?: boolean } | null;

  const schema = z.object({
    username: z.string().min(1, 'Campo obrigatório').email('Email inválido'),
    password: z.string().min(1, 'Campo obrigatório'),
  });

  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = schema.safeParse(formState).success;

  const handleSubmit = async () => {
    logout();

    if (!isFormValid) {
      toast('E-mail ou senha incorretos. Tente novamente.');
      return;
    }

    try {
      setIsLoading(true);
      const token = await authService.login(
        formState.username.trim(),
        formState.password.trim(),
      );

      await login(token, state?.from);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('E-mail ou senha incorretos. Tente novamente.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-[458px] max-h-[562px] bg-white shadow-xl rounded-lg p-8'>
        <div className='flex flex-col items-center mb-8'>
          <img src={logo} alt='Clinix Logo' className='w-40 mb-2' />
          <h2 className='text-2xl font-bold text-[#001E2B] mt-4'>
            Acessar o sistema
          </h2>
          {state?.sessionExpired && (
            <p className='mt-3 rounded-md bg-[#fff7ed] px-3 py-2 text-center text-sm font-medium text-[#9a3412]'>
              Sua sessao expirou. Faca login novamente.
            </p>
          )}
        </div>

        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='font-bold text-sm text-[#001E2B]'>
              E-mail
            </label>
            <input
              className='w-full border border-gray-200 rounded-md px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-ui-button transition-colors'
              type='email'
              placeholder='clinix@clinix.com'
              name='email'
              id='email'
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
            disabled={!isFormValid}
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
      <ToastContainer />
    </section>
  );
};

export default Login;
