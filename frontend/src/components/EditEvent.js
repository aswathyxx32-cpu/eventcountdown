import { useState } from "react";

const API_URL = "https://daydream-7ho9.onrender.com";

function EditEvent({
  event,
  onEventUpdated,
  onCancel,
}) {
  const [title, setTitle] = useState(
    event.title || ""
  );

  const [targetDate, setTargetDate] = useState(
    event.target_date
      ? event.target_date.slice(0, 16)
      : ""
  );

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage("Please login first.");
      return;
    }

    const user = JSON.parse(storedUser);

    const updatedEvent = {
      title: title,
      target_date: targetDate,
      owner: event.owner,
    };

    fetch(
      `${API_URL}/api/events/${event.id}/`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },

        body: JSON.stringify(updatedEvent),
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
            data.error ||
            "Failed to update event"
          );
        }

        return data;
      })
      .then((data) => {
        console.log("Event updated:", data);

        onEventUpdated(data);
      })
      .catch((error) => {
        console.error(
          "Error updating event:",
          error
        );

        setMessage(error.message);
      });
  };

  return (
    <form
      className="add-event-form"
      onSubmit={handleSubmit}
    >

      <h2>
        Edit Event
      </h2>

      <input
        type="text"
        placeholder="Event name"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        required
      />

      <input
        type="datetime-local"
        value={targetDate}
        onChange={(e) =>
          setTargetDate(e.target.value)
        }
        required
      />

      <button type="submit">
        Save Changes
      </button>

      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

    </form>
  );
}

export default EditEvent;