import { useState, useCallback } from "react";
import {
  EventItem,
  Booking,
  BookingFormData,
  BookingResult,
  BookingStatus,
  EventStatus,
  TicketTier,
  TicketPrice,
  CreateEventForm,
  UseBookingReturn,
} from "../types";
import { initialEvents } from "../data/events";

// Helper: generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useBooking(): UseBookingReturn {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // ── Get available seats for a tier ────────
  const getAvailableSeats = useCallback(
    (eventId: string, tier: TicketTier): number => {
      const event: EventItem | undefined = events.find(
        (e: EventItem) => e.id === eventId
      );
      if (!event) return 0;

      const ticketInfo: TicketPrice | undefined = event.tickets.find(
        (t: TicketPrice) => t.tier === tier
      );
      if (!ticketInfo) return 0;

      return ticketInfo.totalSeats - ticketInfo.bookedSeats;
    },
    [events]
  );

  // ── Book an event ─────────────────────────
  const bookEvent = useCallback(
    (eventId: string, formData: BookingFormData): BookingResult => {
      // Find the event
      const event: EventItem | undefined = events.find(
        (e: EventItem) => e.id === eventId
      );

      if (!event) {
        return { success: false, message: "❌ Event not found!" };
      }

      // Check event status
      if (event.status === EventStatus.CANCELLED) {
        return { success: false, message: "❌ This event has been cancelled!" };
      }

      if (event.status === EventStatus.SOLD_OUT) {
        return { success: false, message: "❌ This event is sold out!" };
      }

      // Find ticket tier
      const ticketInfo: TicketPrice | undefined = event.tickets.find(
        (t: TicketPrice) => t.tier === formData.tier
      );

      if (!ticketInfo) {
        return { success: false, message: "❌ Invalid ticket tier!" };
      }

      // 🔷 THIS IS WHERE TS PREVENTS OVERBOOKING!
      const available: number = ticketInfo.totalSeats - ticketInfo.bookedSeats;

      if (formData.quantity > available) {
        return {
          success: false,
          message: `❌ Only ${available} ${formData.tier} tickets available! You requested ${formData.quantity}.`,
        };
      }

      if (formData.quantity <= 0) {
        return { success: false, message: "❌ Quantity must be at least 1!" };
      }

      // Calculate total
      const totalPrice: number = ticketInfo.price * formData.quantity;

      // Create booking
      const newBooking: Booking = {
        id: generateId(),
        eventId: event.id,
        eventTitle: event.title,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        tier: formData.tier,
        quantity: formData.quantity,
        totalPrice,
        bookingDate: new Date().toISOString(),
        status: BookingStatus.CONFIRMED,
      };

      // Update event seats
      setEvents((prev: EventItem[]) =>
        prev.map((e: EventItem) => {
          if (e.id !== eventId) return e;

          const updatedTickets: TicketPrice[] = e.tickets.map(
            (t: TicketPrice) => {
              if (t.tier !== formData.tier) return t;
              return { ...t, bookedSeats: t.bookedSeats + formData.quantity };
            }
          );

          // Check if all tiers sold out
          const allSoldOut: boolean = updatedTickets.every(
            (t: TicketPrice) => t.bookedSeats >= t.totalSeats
          );

          return {
            ...e,
            tickets: updatedTickets,
            status: allSoldOut ? EventStatus.SOLD_OUT : e.status,
          };
        })
      );

      // Save booking
      setBookings((prev: Booking[]) => [...prev, newBooking]);

      return {
        success: true,
        booking: newBooking,
        message: `✅ Booked ${formData.quantity} ${formData.tier} ticket(s) for "${event.title}"! Total: $${totalPrice.toFixed(2)}`,
      };
    },
    [events]
  );

  // ── Cancel booking ────────────────────────
  const cancelBooking = useCallback(
    (bookingId: string): void => {
      const booking: Booking | undefined = bookings.find(
        (b: Booking) => b.id === bookingId
      );

      if (!booking) return;

      // Restore seats
      setEvents((prev: EventItem[]) =>
        prev.map((e: EventItem) => {
          if (e.id !== booking.eventId) return e;

          const updatedTickets: TicketPrice[] = e.tickets.map(
            (t: TicketPrice) => {
              if (t.tier !== booking.tier) return t;
              return {
                ...t,
                bookedSeats: Math.max(0, t.bookedSeats - booking.quantity),
              };
            }
          );

          return {
            ...e,
            tickets: updatedTickets,
            status: EventStatus.UPCOMING,
          };
        })
      );

      // Update booking status
      setBookings((prev: Booking[]) =>
        prev.map((b: Booking) =>
          b.id === bookingId
            ? { ...b, status: BookingStatus.CANCELLED }
            : b
        )
      );
    },
    [bookings]
  );

  // ── Create new event ──────────────────────
  const createEvent = useCallback(
    (form: CreateEventForm): EventItem => {
      const newEvent: EventItem = {
        id: generateId(),
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        image: form.image || "📅",
        category: form.category,
        status: EventStatus.UPCOMING,
        organizer: form.organizer,
        tickets: [
          {
            tier: TicketTier.GENERAL,
            price: form.generalPrice,
            totalSeats: form.generalSeats,
            bookedSeats: 0,
          },
          {
            tier: TicketTier.VIP,
            price: form.vipPrice,
            totalSeats: form.vipSeats,
            bookedSeats: 0,
          },
          {
            tier: TicketTier.PREMIUM,
            price: form.premiumPrice,
            totalSeats: form.premiumSeats,
            bookedSeats: 0,
          },
        ],
      };

      setEvents((prev: EventItem[]) => [newEvent, ...prev]);
      return newEvent;
    },
    []
  );

  return {
    events,
    bookings,
    bookEvent,
    cancelBooking,
    createEvent,
    getAvailableSeats,
  };
}