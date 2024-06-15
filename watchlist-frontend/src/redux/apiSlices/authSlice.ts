import { User } from '../slices/userSlice';
import { apiSlice } from './apiSlice';

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    whoAmI: builder.query<User, void>({
      query: () => ({
        url: '/auth/whoami',
      }),
      providesTags: ['User'],
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: '/auth/signin',
        method: 'post',
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'post',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/auth/update-profile',
        method: 'post',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    createRequestToken: builder.query<any, void>({
      query: () => ({
        url: '/auth/request-token',
      }),
    }),
    authorizeRequestToken: builder.query<any, void>({
      query: () => ({
        url: '/auth/authorize-token',
      }),
    }),
  }),
});

export const {
  useWhoAmIQuery,
  useLazyWhoAmIQuery,
  useSigninMutation,
  useSignupMutation,
  useUpdateProfileMutation,
  useLazyCreateRequestTokenQuery,
  useLazyAuthorizeRequestTokenQuery,
} = authSlice;
