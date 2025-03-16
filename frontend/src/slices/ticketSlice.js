import { createSlice } from '@reduxjs/toolkit';

const storedTicketId =
  typeof window !== 'undefined'
    ? localStorage.getItem('selectedTicketId')
    : null;

const initialState = {
  selectedTicketId:
    storedTicketId && storedTicketId !== 'null'
      ? JSON.parse(storedTicketId)
      : null,
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicketId = action.payload;
      if (action.payload === null) {
        localStorage.removeItem('selectedTicketId'); // Remove when null
      } else {
        localStorage.setItem(
          'selectedTicketId',
          JSON.stringify(action.payload),
        );
      }
    },
  },
});

export const { setSelectedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
