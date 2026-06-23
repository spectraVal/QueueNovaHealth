import axiosInstance from '../api/axiosInstance';
import type {
  RegisterPayload,
  LoginPayload,
  LoginResponseData,
  AuthUser,
  ApiSuccessResponse,
} from '../types/auth';

const CSRF_COOKIE_URL = `${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`;

async function initCsrf(): Promise<void> {
  await axiosInstance.get(CSRF_COOKIE_URL, { baseURL: '' });
}

export const authService = {
  async register(
    payload: RegisterPayload
  ): Promise<ApiSuccessResponse<AuthUser>> {
    await initCsrf();
    const response = await axiosInstance.post<ApiSuccessResponse<AuthUser>>(
      '/auth/register',
      payload
    );
    return response.data;
  },

  async login(
    payload: LoginPayload
  ): Promise<ApiSuccessResponse<LoginResponseData>> {
    await initCsrf();
    const response = await axiosInstance.post<ApiSuccessResponse<LoginResponseData>>(
      '/auth/login',
      payload
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  },
};