import { Booking, BookingStatus } from "../types";

interface MyBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export function MyBookings({ bookings, onCancelBooking }: MyBookingsProps) {
  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmedBookings: Booking[] = bookings.filter(
    (b: Booking) => b.status === BookingStatus.CONFIRMED
  );
  const cancelledBookings: Booking[] = bookings.filter(
    (b: Booking) => b.status === BookingStatus.CANCELLED
  );

  const totalSpent: number = confirmedBookings.reduce(
    (sum: number, b: Booking) => sum + b.totalPrice,
    0
  );

  if (bookings.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🎫</div>
        <h2>No bookings yet</h2>
        <p>Browse events and book your first ticket!</p>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2>🎫 My Bookings</h2>

      {/* Stats */}
      <div className="booking-stats">
        <div className="stat-card">
          <span className="stat-number">{confirmedBookings.length}</span>
          <span className="stat-label">Active Bookings</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{cancelledBookings.length}</span>
          <span className="stat-label">Cancelled</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">${totalSpent.toFixed(2)}</span>
          <span className="stat-label">Total Spent</span>
        </div>
      </div>

      {/* Booking list */}
      <div className="bookings-list">
        {bookings.map((booking: Booking) => (
          <div
            key={booking.id}
            className={`booking-card ${
              booking.status === BookingStatus.CANCELLED ? "cancelled" : ""
            }`}
          >
            <div className="booking-main">
              <h3>{booking.eventTitle}</h3>
              <div className="booking-details">
                <span>👤 {booking.customerName}</span>
                <span>📧 {booking.customerEmail}</span>
                <span>🎫 {booking.tier} × {booking.quantity}</span>
                <span>📅 Booked: {formatDate(booking.bookingDate)}</span>
              </div>
            </div>
            <div className="booking-right">
              <span className="booking-price">
                ${booking.totalPrice.toFixed(2)}
              </span>
              <span
                className={`booking-status ${
                  booking.status === BookingStatus.CONFIRMED
                    ? "status-confirmed"
                    : "status-cancelled"
                }`}
              >
                {booking.status === BookingStatus.CONFIRMED
                  ? "✅ Confirmed"
                  : "❌ Cancelled"}
              </span>
              {booking.status === BookingStatus.CONFIRMED && (
                <button
                  className="cancel-booking-btn"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this booking?"
                      )
                    ) {
                      onCancelBooking(booking.id);
                    }
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}