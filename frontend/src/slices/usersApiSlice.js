import { apiSlices } from './apiSlice';

const BASE_URL = '/api/users';

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
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: constructUrl(''),
        method: 'POST',
        body: data,
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: constructUrl('/profile'),
        method: 'PUT',
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: constructUrl('/logout'),
        method: 'POST',
      }),
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: constructUrl('/create'),
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
