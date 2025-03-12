import { apiSlices } from './apiSlice';

const TICKETS_URL = '/api/tickets';

const ticketApiSlice = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: TICKETS_URL,
        method: 'POST',
        body: data,
        credentials: 'include', // ✅ Ensures cookies are sent
      }),
    }),
    getTickets: builder.query({
      query: ({ page, limit }) => ({
        url: TICKETS_URL,
        params: { page, limit },
        credentials: 'include', // ✅ Ensures cookies are sent
      }),
      providesTags: ['Tickets'],
    }),
    getTicketById: builder.query({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'GET',
        credentials: 'include', // ✅ Ensures cookies are sent
      }),
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'include', // ✅ Ensures cookies are sent
      }),
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include', // ✅ Ensures cookies are sent
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
