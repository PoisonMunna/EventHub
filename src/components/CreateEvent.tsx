import { useState } from "react";
import { CreateEventForm, EventCategory, EventItem } from "../types";

interface CreateEventProps {
  onCreateEvent: (form: CreateEventForm) => EventItem;
  onNavigateToEvents: () => void;
}

const emojis: string[] = [
  "🎵", "💻", "🏃", "🎨", "🍷", "🚀", "🎷", "🤖",
  "🎭", "📷", "🏀", "🎪", "🎸", "🧪", "🎯", "📅",
];

export function CreateEvent({ onCreateEvent, onNavigateToEvents }: CreateEventProps) {
  const [form, setForm] = useState<CreateEventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: EventCategory.TECH,
    image: "📅",
    organizer: "",
    generalSeats: 100,
    generalPrice: 25,
    vipSeats: 30,
    vipPrice: 75,
    premiumSeats: 10,
    premiumPrice: 150,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const updateField = <K extends keyof CreateEventForm>(
    field: K,
    value: CreateEventForm[K]
  ): void => {
    setForm((prev: CreateEventForm) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.date || !form.time || !form.venue || !form.organizer) {
      alert("Please fill in all required fields!");
      return;
    }

    onCreateEvent(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🎉</div>
        <h2>Event Created Successfully!</h2>
        <p>Your event "{form.title}" is now listed.</p>
        <button
          className="book-submit-btn"
          style={{ maxWidth: "300px", margin: "1rem auto" }}
          onClick={onNavigateToEvents}
        >
          View All Events
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <h2>➕ Create New Event</h2>

      <form onSubmit={handleSubmit} className="create-event-form">
        {/* Basic Info */}
        <div className="form-section">
          <h3>📋 Basic Information</h3>

          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your event"
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Venue *</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => updateField("venue", e.target.value)}
              placeholder="Event venue"
              required
            />
          </div>

          <div className="form-group">
            <label>Organizer *</label>
            <input
              type="text"
              value={form.organizer}
              onChange={(e) => updateField("organizer", e.target.value)}
              placeholder="Organizer name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                updateField("category", e.target.value as EventCategory)
              }
            >
              {Object.values(EventCategory).map((cat: EventCategory) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Event Emoji</label>
            <div className="emoji-picker">
              {emojis.map((emoji: string) => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-btn ${form.image === emoji ? "selected" : ""}`}
                  onClick={() => updateField("image", emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Pricing */}
        <div className="form-section">
          <h3>🎫 Ticket Configuration</h3>

          {/* General */}
          <div className="ticket-config">
            <h4>General Tier</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Seats</label>
                <input
                  type="number"
                  min={0}
                  value={form.generalSeats}
                  onChange={(e) =>
                    updateField("generalSeats", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.generalPrice}
                  onChange={(e) =>
                    updateField("generalPrice", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>

          {/* VIP */}
          <div className="ticket-config">
            <h4>VIP Tier</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Seats</label>
                <input
                  type="number"
                  min={0}
                  value={form.vipSeats}
                  onChange={(e) =>
                    updateField("vipSeats", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.vipPrice}
                  onChange={(e) =>
                    updateField("vipPrice", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>

          {/* Premium */}
          <div className="ticket-config">
            <h4>Premium Tier</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Seats</label>
                <input
                  type="number"
                  min={0}
                  value={form.premiumSeats}
                  onChange={(e) =>
                    updateField("premiumSeats", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.premiumPrice}
                  onChange={(e) =>
                    updateField("premiumPrice", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="book-submit-btn">
          🎉 Create Event
        </button>
      </form>
    </div>
  );
}