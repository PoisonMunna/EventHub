// ============================================
// 🔷 STRONG TYPES PREVENT OVERBOOKING!
// ============================================

// Event categories
export enum EventCategory {
  MUSIC = "Music",
  TECH = "Tech",
  SPORTS = "Sports",
  ART = "Art",
  FOOD = "Food",
  BUSINESS = "Business",
}

// Event status - controlled by enum
export enum EventStatus {
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  SOLD_OUT = "sold_out",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

// Ticket tiers
export enum TicketTier {
  GENERAL = "General",
  VIP = "VIP",
  PREMIUM = "Premium",
}

// Price per ticket tier
export interface TicketPrice {
  tier: TicketTier;
  price: number;
  totalSeats: number;
  bookedSeats: number;
}

// Main Event interface
export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;         // ISO date string
  time: string;
  venue: string;
  image: string;
  category: EventCategory;
  status: EventStatus;
  organizer: string;
  tickets: TicketPrice[];
}

// Booking record
export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  tier: TicketTier;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: BookingStatus;
}

export enum BookingStatus {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

// Booking form data
export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  tier: TicketTier;
  quantity: number;
}

// Validation errors - each field can have an error
export interface ValidationErrors {
  customerName?: string;
  customerEmail?: string;
  quantity?: string;
}

// Create event form
export interface CreateEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  image: string;
  organizer: string;
  generalSeats: number;
  generalPrice: number;
  vipSeats: number;
  vipPrice: number;
  premiumSeats: number;
  premiumPrice: number;
}

// Booking result - discriminated union
export type BookingResult =
  | { success: true; booking: Booking; message: string }
  | { success: false; message: string };

// Page navigation
export type ActivePage = "events" | "my-bookings" | "create-event";

// What our hook returns
export interface UseBookingReturn {
  events: EventItem[];
  bookings: Booking[];
  bookEvent: (eventId: string, formData: BookingFormData) => BookingResult;
  cancelBooking: (bookingId: string) => void;
  createEvent: (form: CreateEventForm) => EventItem;
  getAvailableSeats: (eventId: string, tier: TicketTier) => number;
}