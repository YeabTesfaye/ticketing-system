import { apiSlices } from './apiSlice';

const TICKETS_URL = '/api/tickets';

const ticketApiSlice = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: TICKETS_URL,
        method: 'POST',
        body: data,
        credentials: 'include', 
      }),
    }),
    getTickets: builder.query({
      query: ({ page, limit }) => ({
        url: TICKETS_URL,
        params: { page, limit },
        credentials: 'include', 
      }),
      providesTags: ['Tickets'],
    }),
    getTicketById: builder.query({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'GET',
        credentials: 'include', 
      }),
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'include', 
      }),
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `${TICKETS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include', 
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
