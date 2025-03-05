import { apiSlices } from './apiSlice';

const TICKETS_URL = 'https://ticketing-system-1-bwql.onrender.com/api/tickets';

const ticketApiSlice = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: TICKETS_URL,
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    getTickets: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `${TICKETS_URL}?page=${page}&limit=${limit}`,
      providesTags: ['Tickets'],
    }),
    getTicketById: builder.query({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'PUT',
        body: { status },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
} = ticketApiSlice;
