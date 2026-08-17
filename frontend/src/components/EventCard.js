import { useEffect, useState } from "react";

function EventCard({ event, onDelete, onEdit }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateCountdown() {
      const target = new Date(event.target_date).getTime();
      const now = new Date().getTime();

      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    }

    calculateCountdown();

    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [event.target_date]);

  return (
    <div className="event-card">

      <h2>{event.title}</h2>

      <p>
        {new Date(event.target_date).toLocaleString()}
      </p>

      <div className="countdown">

        <div>
          <strong>{timeLeft.days}</strong>
          <span>Days</span>
        </div>

        <div>
          <strong>{timeLeft.hours}</strong>
          <span>Hours</span>
        </div>

        <div>
          <strong>{timeLeft.minutes}</strong>
          <span>Minutes</span>
        </div>

        <div>
          <strong>{timeLeft.seconds}</strong>
          <span>Seconds</span>
        </div>

      </div>

      <div className="event-buttons">

  <button
    className="edit-button"
    onClick={() => onEdit(event)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => onDelete(event.id)}
  >
    Delete
  </button>

</div>

    </div>
  );
}

export default EventCard;