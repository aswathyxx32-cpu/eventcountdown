import { useState } from "react";

const API_URL = "https://daydream-7ho9.onrender.com";

function AddEvent({ onEventAdded }) {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
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

    const newEvent = {
      title: title,
      target_date: targetDate,
      owner: user.id,
    };

    fetch(`${API_URL}/api/events/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newEvent),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
            data.error ||
            "Failed to add event"
          );
        }

        return data;
      })
      .then((data) => {
        console.log("Event added:", data);

        onEventAdded(data);

        setTitle("");
        setTargetDate("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error adding event:", error);

        setMessage(error.message);
      });
  };

  return (
    <form
      className="add-event-form"
      onSubmit={handleSubmit}
    >

      <h2>
        Add New Event
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
        Add Event
      </button>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

    </form>
  );
}

export default AddEvent;