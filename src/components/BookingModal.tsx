import { useState, useMemo } from "react";
import {
  EventItem,
  BookingFormData,
  BookingResult,
  TicketTier,
  TicketPrice,
  ValidationErrors,
} from "../types";

interface BookingModalProps {
  event: EventItem;
  onBook: (eventId: string, formData: BookingFormData) => BookingResult;
  onClose: () => void;
  getAvailableSeats: (eventId: string, tier: TicketTier) => number;
}

export function BookingModal({
  event,
  onBook,
  onClose,
  getAvailableSeats,
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerEmail: "",
    tier: TicketTier.GENERAL,
    quantity: 1,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [resultMessage, setResultMessage] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Available seats for selected tier
  const available: number = useMemo(
    () => getAvailableSeats(event.id, formData.tier),
    [event.id, formData.tier, getAvailableSeats]
  );

  // Current tier price
  const tierPrice: number = useMemo(() => {
    const ticket: TicketPrice | undefined = event.tickets.find(
      (t: TicketPrice) => t.tier === formData.tier
    );
    return ticket?.price ?? 0;
  }, [event.tickets, formData.tier]);

  // Total price
  const totalPrice: number = tierPrice * formData.quantity;

  // Validate form
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "At least 1 ticket required";
    } else if (formData.quantity > available) {
      newErrors.quantity = `Only ${available} tickets available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) return;

    const result: BookingResult = onBook(event.id, formData);
    setResultMessage(result.message);

    if (result.success) {
      setIsBooked(true);
    }
  };

  // Update form field
  const updateField = <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ): void => {
    setFormData((prev: BookingFormData) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (field in errors) {
      setErrors((prev: ValidationErrors) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-event-image">{event.image}</span>
          <div>
            <h2>{event.title}</h2>
            <p>
              📅 {event.date} at {event.time} • 📍 {event.venue}
            </p>
          </div>
        </div>

        {isBooked ? (
          <div className="booking-success">
            <div className="success-icon">✅</div>
            <h3>Booking Confirmed!</h3>
            <p>{resultMessage}</p>
            <button className="book-submit-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                value={formData.customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("customerName", e.target.value)
                }
                placeholder="Enter your full name"
                className={errors.customerName ? "input-error" : ""}
              />
              {errors.customerName && (
                <span className="error-text">{errors.customerName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={formData.customerEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField("customerEmail", e.target.value)
                }
                placeholder="Enter your email"
                className={errors.customerEmail ? "input-error" : ""}
              />
              {errors.customerEmail && (
                <span className="error-text">{errors.customerEmail}</span>
              )}
            </div>

            {/* Ticket Tier */}
            <div className="form-group">
              <label>Ticket Tier</label>
              <div className="tier-selector">
                {event.tickets.map((t: TicketPrice) => {
                  const tierAvail: number = t.totalSeats - t.bookedSeats;
                  return (
                    <button
                      key={t.tier}
                      type="button"
                      className={`tier-option ${
                        formData.tier === t.tier ? "selected" : ""
                      } ${tierAvail === 0 ? "disabled" : ""}`}
                      onClick={() => {
                        if (tierAvail > 0) {
                          updateField("tier", t.tier);
                          // Reset quantity if exceeds available
                          if (formData.quantity > tierAvail) {
                            updateField("quantity", tierAvail);
                          }
                        }
                      }}
                      disabled={tierAvail === 0}
                    >
                      <strong>{t.tier}</strong>
                      <span>${t.price.toFixed(2)}</span>
                      <small>{tierAvail} left</small>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="qty">
                Quantity (max {available})
              </label>
              <div className="quantity-input">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    updateField("quantity", Math.max(1, formData.quantity - 1))
                  }
                >
                  −
                </button>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={available}
                  value={formData.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField("quantity", parseInt(e.target.value) || 1)
                  }
                  className={errors.quantity ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    updateField(
                      "quantity",
                      Math.min(available, formData.quantity + 1)
                    )
                  }
                  disabled={formData.quantity >= available}
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <span className="error-text">{errors.quantity}</span>
              )}
            </div>

            {/* Price Summary */}
            <div className="price-summary">
              <div className="price-row">
                <span>
                  {formData.tier} × {formData.quantity}
                </span>
                <span>${tierPrice.toFixed(2)} each</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {resultMessage && !isBooked && (
              <p className="error-message">{resultMessage}</p>
            )}

            <button
              type="submit"
              className="book-submit-btn"
              disabled={available === 0}
            >
              {available === 0
                ? "Sold Out"
                : `Confirm Booking — $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}