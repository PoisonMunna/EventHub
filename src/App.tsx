import { useState } from "react";
import { ActivePage, EventItem } from "./types";
import { useBooking } from "./hooks/useBooking";
import { Header } from "./components/Header";
import { EventList } from "./components/EventList";
import { BookingModal } from "./components/BookingModal";
import { MyBookings } from "./components/MyBookings";
import { CreateEvent } from "./components/CreateEvent";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState<ActivePage>("events");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const booking = useBooking();

  const handleBookClick = (event: EventItem): void => {
    setSelectedEvent(event);
  };

  const handleCloseModal = (): void => {
    setSelectedEvent(null);
  };

  // Render current page
  const renderPage = (): React.ReactNode => {
    switch (activePage) {
      case "events":
        return (
          <EventList events={booking.events} onBookClick={handleBookClick} />
        );
      case "my-bookings":
        return (
          <MyBookings
            bookings={booking.bookings}
            onCancelBooking={booking.cancelBooking}
          />
        );
      case "create-event":
        return (
          <CreateEvent
            onCreateEvent={booking.createEvent}
            onNavigateToEvents={() => setActivePage("events")}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onPageChange={setActivePage}
        bookings={booking.bookings}
      />

      <main className="main-content">{renderPage()}</main>

      {/* Booking Modal */}
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onBook={booking.bookEvent}
          onClose={handleCloseModal}
          getAvailableSeats={booking.getAvailableSeats}
        />
      )}

      <footer className="footer">
        <p>
          🔷 Built with TypeScript — Overbooking is IMPOSSIBLE thanks to strict
          typing!
        </p>
      </footer>
    </div>
  );
}

export default App;