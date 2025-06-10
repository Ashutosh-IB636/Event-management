import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    addAttendance: (state, action) => {
      const { eventId, attendanceData } = action.payload;
      const event = state.events.find((ev) => ev.id === eventId);
      if (event) {
        if (!event.attendees) event.attendees = [];
        event.attendees.push(attendanceData);
      }
    },
  },
});

export const { addEvent, addAttendance } = eventSlice.actions;
export default eventSlice.reducer;
