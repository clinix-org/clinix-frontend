type AppEnvironment = 'local' | 'development' | 'production';

const required = (name: string, value: string | undefined) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return normalizedValue;
};

const parseAppEnvironment = (value: string): AppEnvironment => {
  if (value === 'local' || value === 'development' || value === 'production') {
    return value;
  }

  throw new Error(`VITE_APP_ENV invalido: ${value}`);
};

const parseApiUrl = (value: string, appEnvironment: AppEnvironment) => {
  const normalizedValue = value.replace(/\/+$/, '');
  const isRelativeUrl = normalizedValue.startsWith('/');

  if (!isRelativeUrl) {
    let url: URL;

    try {
      url = new URL(normalizedValue);
    } catch {
      throw new Error('VITE_API_URL deve ser uma URL HTTP(S) ou um caminho relativo');
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('VITE_API_URL deve usar HTTP ou HTTPS');
    }

    if (appEnvironment === 'production' && url.protocol !== 'https:') {
      throw new Error('VITE_API_URL deve usar HTTPS em producao');
    }
  }

  return normalizedValue;
};

const appEnvironment = parseAppEnvironment(
  required('VITE_APP_ENV', import.meta.env.VITE_APP_ENV),
);

export const env = Object.freeze({
  appEnvironment,
  apiUrl: parseApiUrl(
    required('VITE_API_URL', import.meta.env.VITE_API_URL),
    appEnvironment,
  ),
  isProduction: appEnvironment === 'production',
});
