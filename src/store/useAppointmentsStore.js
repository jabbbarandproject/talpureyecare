import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Persisted appointment bookings from the Book Appointment page. */
export const useAppointmentsStore = create(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appt) =>
        set((state) => ({ appointments: [appt, ...state.appointments] })),
    }),
    {
      name: "talpur-appointments-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
