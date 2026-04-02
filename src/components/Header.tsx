import { ActivePage, Booking, BookingStatus } from "../types";

interface HeaderProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  bookings: Booking[];
}

export function Header({ activePage, onPageChange, bookings }: HeaderProps) {
  const activeBookings: number = bookings.filter(
    (b: Booking) => b.status === BookingStatus.CONFIRMED
  ).length;

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">🎟️ EventHub</h1>
        <p className="tagline">Type-safe event booking</p>

        <nav className="nav-tabs">
          <button
            className={`tab-btn ${activePage === "events" ? "active" : ""}`}
            onClick={() => onPageChange("events")}
          >
            📅 Events
          </button>
          <button
            className={`tab-btn ${activePage === "my-bookings" ? "active" : ""}`}
            onClick={() => onPageChange("my-bookings")}
          >
            🎫 My Bookings
            {activeBookings > 0 && (
              <span className="cart-badge">{activeBookings}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activePage === "create-event" ? "active" : ""}`}
            onClick={() => onPageChange("create-event")}
          >
            ➕ Create Event
          </button>
        </nav>
      </div>
    </header>
  );
}