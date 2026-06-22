import axiosInstance from '../api/axiosInstance';
import type {
  RegisterPayload,
  LoginPayload,
  LoginResponseData,
  AuthUser,
  ApiSuccessResponse,
} from '../types/auth';

export const authService = {
  async register(
    payload: RegisterPayload
  ): Promise<ApiSuccessResponse<AuthUser>> {
    const response = await axiosInstance.post<ApiSuccessResponse<AuthUser>>(
      '/auth/register',
      payload
    );
    return response.data;
  },

  async login(
    payload: LoginPayload
  ): Promise<ApiSuccessResponse<LoginResponseData>> {
    const response = await axiosInstance.post<
ApiSuccessResponse<LoginResponseData>
>('/auth/login', payload);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  },
};