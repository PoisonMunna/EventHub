import { useState } from "react";
import { EventItem, EventCategory } from "../types";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: EventItem[];
  onBookClick: (event: EventItem) => void;
}

export function EventList({ events, onBookClick }: EventListProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "All"
  >("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredEvents: EventItem[] = events.filter((event: EventItem) => {
    const matchesCategory: boolean =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch: boolean =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: string[] = ["All", ...Object.values(EventCategory)];

  return (
    <div className="event-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search events or venues..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="search-input"
        />
        <div className="category-filters">
          {categories.map((cat: string) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() =>
                setSelectedCategory(cat as EventCategory | "All")
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="product-count">
        Showing {filteredEvents.length} of {events.length} events
      </p>

      <div className="events-grid">
        {filteredEvents.map((event: EventItem) => (
          <EventCard
            key={event.id}
            event={event}
            onBookClick={onBookClick}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-results">
          <p>😕 No events found</p>
        </div>
      )}
    </div>
  );
}