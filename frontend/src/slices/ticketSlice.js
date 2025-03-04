import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTicket: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },
    updateTicket: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.tickets.find((ticket) => ticket._id === id);
      if (ticket) ticket.status = status;
    },
  },
});

export const { setTickets, addTicket, updateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
