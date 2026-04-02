🎟️ EventHub — Event Booking System

A fully functional event booking platform built with **TypeScript + React + Vite**.  
This project demonstrates how TypeScript prevents overbooking, invalid data, and runtime errors through strict typing.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 📸 Features

### 📅 Events Page
- Browse 8 pre-loaded events across 6 categories
- Search events by name or venue
- Filter by category (Music, Tech, Sports, Art, Food, Business)
- Real-time seat availability with progress bars
- View pricing for all ticket tiers (General, VIP, Premium)
- Status indicators (Upcoming, Sold Out, Cancelled)

### 🎫 Booking System
- Interactive booking modal with form validation
- Choose ticket tier (General / VIP / Premium)
- Select quantity with availability checks
- Real-time price calculation
- Overbooking prevention (TypeScript enforced!)
- Booking confirmation with animated popup

### 📋 My Bookings
- View all booking history
- Active booking count and total spent stats
- Cancel bookings with seat restoration
- Booking status tracking (Confirmed / Cancelled)
- Detailed booking information display

### ➕ Create Event
- Create custom events with full details
- Set ticket pricing for all 3 tiers
- Configure seat capacity per tier
- Choose event category and emoji icon
- New events appear instantly in the events list

---

## 🔷 TypeScript Concepts Demonstrated

| Concept                | Where It's Used                                |
|------------------------|------------------------------------------------|
| `interface`            | EventItem, Booking, TicketPrice, BookingFormData |
| `enum`                 | EventCategory, EventStatus, TicketTier, BookingStatus |
| `discriminated unions` | BookingResult (`success: true` \| `success: false`) |
| `strict null checks`   | `EventItem \| null`, `TicketPrice \| undefined` |
| `generic functions`    | `updateField<K extends keyof T>()` pattern     |
| `React event types`    | `FormEvent`, `ChangeEvent`, `MouseEvent`       |
| `custom hooks typing`  | UseBookingReturn interface                      |
| `exhaustive switch`    | EventStatus switch with all cases              |
| `computed values`      | useMemo for availability calculations          |
| `callback typing`      | useCallback with typed parameters              |
| `array method types`   | `.find()`, `.filter()`, `.reduce()`, `.map()`  |
| `validation types`     | ValidationErrors interface                     |

---

## 🛡️ How TypeScript Prevents Overbooking

```typescript
// The core anti-overbooking logic — fully typed!

const available: number = ticketInfo.totalSeats - ticketInfo.bookedSeats;

// ✅ TypeScript ensures these are ALWAYS numbers
// ✅ Can never be undefined, null, or string
// ✅ Comparison is always valid

if (formData.quantity > available) {
  return {
    success: false,  // Discriminated union — must include message
    message: `Only ${available} tickets available!`,
  };
}

// Without TypeScript:
// ticketInfo.totalSeats could be "100" (string)
// formData.quantity could be undefined
// "undefined" > "100" → no error, but WRONG behavior
// Result: OVERBOOKING! 💥
```

## 📁 Project Structure

```bash

event-booking/  
├── public/   
│   └── vite.svg  
├── src/  
│   ├── types/  
│   │   └── index.ts              # All TypeScript interfaces & enums  
│   ├── data/  
│   │   └── events.ts             # Mock event data (8 events)   
│   ├── hooks/  
│   │   └── useBooking.ts         # Booking logic (book, cancel, create, validate)  
│   ├── components/  
│   │   ├── Header.tsx            # Navigation with active bookings badge  
│   │   ├── EventCard.tsx         # Event display with availability bar  
│   │   ├── EventList.tsx         # Events grid with search & filters  
│   │   ├── BookingModal.tsx      # Booking form with validation & tier selection  
│   │   ├── MyBookings.tsx        # Booking history with stats & cancel option  
│   │   └── CreateEvent.tsx       # New event creation form  
│   ├── App.tsx                   # Main app with page navigation  
│   ├── App.css                   # All styles  
│   └── main.tsx                  # Entry point  
├── index.html  
├── package.json  
├── tsconfig.json  
├── tsconfig.app.json  
├── vite.config.ts  
└── README.md  
  
```
