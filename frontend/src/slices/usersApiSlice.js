import { apiSlices } from './apiSlice';

const BASE_URL = 'https://ticketing-system-backend-3.onrender.com/api/users';

// Helper function to construct URLs
const constructUrl = (endpoint, params = '') =>
  `${BASE_URL}${endpoint}${params}`;

export const usersApiSlice = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: constructUrl('/auth'),
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: constructUrl(''),
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: constructUrl('/profile'),
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: constructUrl('/logout'),
        method: 'POST',
        credentials: 'include',
      }),
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: constructUrl(''),
        method: 'POST',
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        constructUrl(`?page=${page}&limit=${limit}`),
      providesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: constructUrl(`/${userId}`),
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = usersApiSlice;
