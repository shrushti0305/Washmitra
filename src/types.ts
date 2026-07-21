export type UserRole = 'ADMIN' | 'WASHMITRA' | 'CUSTOMER' | 'INSTITUTION';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_paid: boolean;
  phone?: string;
  avatar_url?: string;
  district?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issued_at: string;
  level: 'BASIC' | 'ADVANCED' | 'PRO';
  skills: string[];
}

export interface ToolkitItem {
  name: string;
  id: string;
  status: 'FUNCTIONAL' | 'DAMAGED' | 'MISSING';
  last_checked: string;
}

export interface WashMitraProfile extends UserProfile {
  is_certified: boolean;
  certification_date?: string;
  service_radius: number; // in km
  categories: string[];
  documents: {
    type: string;
    url: string;
  }[];
  rating: number;
  total_services: number;
  certifications?: Certification[];
  toolkit?: ToolkitItem[];
  earnings: {
    total: number;
    pending: number;
    last_withdrawal?: string;
  };
}

export interface InstitutionalProfile extends UserProfile {
  institution_type: 'SCHOOL' | 'PANCHAYAT' | 'HOSPITAL';
  assets: {
    id: string;
    type: string;
    last_service: string;
    health_score: number;
    status: 'OPERATIONAL' | 'NEEDS_MAINTENANCE' | 'DYSFUNCTIONAL';
  }[];
  amc_expiry: string;
}

export interface PlatformMetrics {
  total_washmitras: number;
  women_washmitras: number;
  total_revenue: number;
  revenue_target: number;
  districts_covered: number;
  jjm_alignment_score: number;
  sbm_alignment_score: number;
}

export interface TrainingBatch {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  district?: string;
  trainees_count?: number;
  batch_code?: string;
  max_candidates: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Matches the real `services` table (was previously mismatched as "ServiceTask"
// with name/labor_charge — the live DB uses title/base_price).
export interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  base_price: number;
  image_url?: string;
  is_active: boolean;
}

export type RequestStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'EN_ROUTE' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED'
  | 'BILLED';

// Matches the real `bookings` table columns exactly.
export interface Booking {
  id: string;
  name: string | null;
  phone: string | null;
  location: string | null;
  service: string | null;
  user_id: string | null;
  service_id: string | null;
  washmitra_id: string | null;
  status: RequestStatus;
  address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  scheduled_date: string | null;
  total_price: number;
  visit_charge: number;
  travel_charge: number;
  labor_charge: number;
  otp_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Estimate {
  visit_charge: number;
  travel_charge: number;
  labor_charge: number;
  total: number;
}

export interface Invoice {
  id: string;
  request_id: string;
  customer_id: string;
  washmitra_id: string;
  items: {
    description: string;
    amount: number;
  }[];
  total_amount: number;
  platform_fee: number;
  status: 'PAID' | 'UNPAID' | 'REFUNDED';
  payment_method?: 'UPI' | 'CARD' | 'CASH';
  created_at: string;
}

export interface WashMartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  stock: number;
  category: string;
}

export interface Rating {
  id: string;
  request_id: string;
  customer_id: string;
  washmitra_id: string;
  score: number;
  comment: string;
  created_at: string;
}

export interface HelpdeskTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  created_at: string;
}
