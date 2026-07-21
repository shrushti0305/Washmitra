import { create } from 'zustand';
import { UserProfile, Booking, ServiceCategory, Service, TrainingBatch, WashMartItem } from '../types';

interface TransientTransaction {
  fullName: string;
  mobile: string;
  location: string;
  courseName?: string;
  amount: number;
  paymentMethod: 'UPI' | 'NETBANKING';
  bankName?: string;
}

interface WashMitraState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Operational requests management
  requests: Booking[];
  setRequests: (requests: Booking[]) => void;
  addRequest: (request: Booking) => void;
  updateRequest: (id: string, updates: Partial<Booking>) => void;

  // Static content decks
  categories: ServiceCategory[];
  services: Service[];
  trainingBatches: TrainingBatch[];
  washMartItems: WashMartItem[];

  setInitialData: (data: {
    categories: ServiceCategory[];
    services: Service[];
    batches: TrainingBatch[];
    martItems: WashMartItem[];
  }) => void;

  // Financial tracking states for first-time onboarding
  isFirstTimeMitra: boolean;
  setIsFirstTimeMitra: (status: boolean) => void;

  isProcessingPayment: boolean;
  setIsProcessingPayment: (status: boolean) => void;

  currentTransaction: TransientTransaction | null;
  setCurrentTransaction: (transaction: TransientTransaction | null) => void;
}

export const useStore = create<WashMitraState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),

  categories: [],
  services: [],
  trainingBatches: [],
  washMartItems: [],

  setInitialData: (data) => set({
    categories: data.categories,
    services: data.services,
    trainingBatches: data.batches,
    washMartItems: data.martItems
  }),

  isFirstTimeMitra: true,
  setIsFirstTimeMitra: (status) => set({ isFirstTimeMitra: status }),

  isProcessingPayment: false,
  setIsProcessingPayment: (status) => set({ isProcessingPayment: status }),

  currentTransaction: null,
  setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),
}));
