import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formatDate } from "../../Utils/functions.util";
import {
  ChangeAppointmentStatus,
  getAllDoctorAppointments,
} from "../../API/appointmentApi";

export const fetchAllAppointments = createAsyncThunk(
  "Appointments/fetchAllAppointments",
  async (id, thunkAPI) => {
    try {
      const appointments = await getAllDoctorAppointments(id);
      return appointments.data.Appointments;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const changeAppointment = createAsyncThunk(
  "Appointments/ChangeAppointmentStatus",
  async ({ id, status, docid }, thunkAPI) => {
    try {
      const promises = id.map(async (el) => {
        const response = await ChangeAppointmentStatus(el, status);
        response === "successful";
      });
      const results = await Promise.all(promises);
      const allSuccessful = results.every((result) => result === true);

      await thunkAPI.dispatch(fetchAllAppointments(docid));

      return allSuccessful;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const AppointmentsSlice = createSlice({
  name: "Appointments",
  initialState: {
    Appointments: [],
    loading: false,
    error: "",
  }, // Initialize state from cookies
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        const data = action.payload.map((el) => {
          return {
            ...el,
            name: el.patientfirstname + " " + el.patientlastname,
            id: el.appointmentid,
            bookingdate: formatDate(el.bookingdate),
            appointmentdate: formatDate(el.appointmentdate),
          };
        });
        state.Appointments = data;
        state.loading = false;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(changeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeAppointment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default AppointmentsSlice.reducer;