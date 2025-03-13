import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   tickets: [],
//   selectedTicketId: null,
// };

const initialState = {
  selectedTicketId: localStorage.getItem('selectedTicketId')
    ? JSON.parse(localStorage.getItem('selectedTicketId'))
    : null,
};
const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicketId = action.payload;
      localStorage.setItem('selectedTicketId', JSON.stringify(action.payload));
    },
  },
});

export const { setTickets, addTicket, updateTicket, setSelectedTicket } =
  ticketSlice.actions;
export default ticketSlice.reducer;
