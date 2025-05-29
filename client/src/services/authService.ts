import api from './api';

export interface LoginResponse {
  token: string;
}

export const apiLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const apiRegister = async (email: string, password: string): Promise<void> => {
  await api.post('/auth/register', { email, password });
};