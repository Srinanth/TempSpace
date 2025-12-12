import { cleanEnv, str, port } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    SUPABASE_URL: str(),
    SUPABASE_SERVICE_KEY: str(),
  });
};