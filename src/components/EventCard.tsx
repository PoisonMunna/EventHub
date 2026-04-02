import { EventItem, EventStatus, TicketPrice } from "../types";

interface EventCardProps {
  event: EventItem;
  onBookClick: (event: EventItem) => void;
}

export function EventCard({ event, onBookClick }: EventCardProps) {
  // Calculate total availability
  const totalSeats: number = event.tickets.reduce(
    (sum: number, t: TicketPrice) => sum + t.totalSeats,
    0
  );
  const bookedSeats: number = event.tickets.reduce(
    (sum: number, t: TicketPrice) => sum + t.bookedSeats,
    0
  );
  const availableSeats: number = totalSeats - bookedSeats;
  const bookingPercentage: number = Math.round((bookedSeats / totalSeats) * 100);

  // Cheapest price
  const minPrice: number = Math.min(
    ...event.tickets.map((t: TicketPrice) => t.price)
  );

  const isSoldOut: boolean = event.status === EventStatus.SOLD_OUT || availableSeats === 0;
  const isCancelled: boolean = event.status === EventStatus.CANCELLED;

  // Format date nicely
  const formatDate = (dateStr: string): string => {
    const date: Date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge color
  const getStatusClass = (status: EventStatus): string => {
    switch (status) {
      case EventStatus.UPCOMING:
        return "status-upcoming";
      case EventStatus.ONGOING:
        return "status-ongoing";
      case EventStatus.SOLD_OUT:
        return "status-soldout";
      case EventStatus.CANCELLED:
        return "status-cancelled";
      case EventStatus.COMPLETED:
        return "status-completed";
    }
  };

  return (
    <div className={`event-card ${isSoldOut || isCancelled ? "unavailable" : ""}`}>
      <div className="event-image">{event.image}</div>

      <div className="event-content">
        <div className="event-top-row">
          <span className="event-category-badge">{event.category}</span>
          <span className={`event-status-badge ${getStatusClass(event.status)}`}>
            {isSoldOut ? "Sold Out" : event.status}
          </span>
        </div>

        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc">{event.description}</p>

        <div className="event-details">
          <span>📅 {formatDate(event.date)}</span>
          <span>⏰ {event.time}</span>
          <span>📍 {event.venue}</span>
          <span>🎤 {event.organizer}</span>
        </div>

        {/* Availability bar */}
        <div className="availability-section">
          <div className="availability-header">
            <span>🎫 {availableSeats} / {totalSeats} seats available</span>
            <span>{bookingPercentage}% booked</span>
          </div>
          <div className="availability-bar">
            <div
              className="availability-fill"
              style={{
                width: `${bookingPercentage}%`,
                backgroundColor:
                  bookingPercentage > 90
                    ? "#d63031"
                    : bookingPercentage > 60
                    ? "#fdcb6e"
                    : "#00b894",
              }}
            />
          </div>
        </div>

        {/* Ticket prices */}
        <div className="ticket-prices">
          {event.tickets.map((t: TicketPrice) => {
            const tierAvailable: number = t.totalSeats - t.bookedSeats;
            return (
              <div
                key={t.tier}
                className={`tier-badge ${tierAvailable === 0 ? "sold-out" : ""}`}
              >
                <span className="tier-name">{t.tier}</span>
                <span className="tier-price">${t.price.toFixed(2)}</span>
                <span className="tier-seats">{tierAvailable} left</span>
              </div>
            );
          })}
        </div>

        <div className="event-footer">
          <span className="starting-price">From ${minPrice.toFixed(2)}</span>
          <button
            className="book-btn"
            onClick={() => onBookClick(event)}
            disabled={isSoldOut || isCancelled}
          >
            {isSoldOut ? "Sold Out" : isCancelled ? "Cancelled" : "Book Now 🎟️"}
          </button>
        </div>
      </div>
    </div>
  );
}