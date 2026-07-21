import { create } from 'zustand';
import { SHOW_TRANSACTIONAL_FEATURES } from '../lib/featureFlags';
import { toast } from 'sonner';

interface BookingState {
  selectedService: string | null;   // display title, shown in the modal
  selectedServiceId: string | null; // real services.id, used for the DB insert
  isModalOpen: boolean;
  isTrackingOpen: boolean;
  setSelectedService: (service: string | null) => void;
  setModalOpen: (open: boolean) => void;
  setTrackingOpen: (open: boolean) => void;
  openBookingFor: (service: string, serviceId?: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  selectedServiceId: null,
  isModalOpen: false,
  isTrackingOpen: false,
  setSelectedService: (service) => set({ selectedService: service }),
  setModalOpen: (open) => set({ isModalOpen: open }),
  setTrackingOpen: (open) => set({ isTrackingOpen: open }),
  openBookingFor: (service, serviceId) => {
    // Booking/payment is intentionally hidden for the donor-facing launch.
    // Flip SHOW_TRANSACTIONAL_FEATURES in lib/featureFlags.ts when ready.
    if (!SHOW_TRANSACTIONAL_FEATURES) {
      toast.info('Bookings open soon — reach out via our Contact page in the meantime.');
      return;
    }
    set({ selectedService: service, selectedServiceId: serviceId ?? null, isModalOpen: true });
  },
}));
