import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import EventCard from "./EventCard";
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";

const API_URL = "https://daydream-7ho9.onrender.com";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // GET USER EVENTS
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(`${API_URL}/api/events/?owner=${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${user.token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch events"
          );
        }

        return data;
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [navigate]);

  // ADD EVENT
  const handleEventAdded = (newEvent) => {
    setEvents((previousEvents) => [
      ...previousEvents,
      newEvent,
    ]);
  };

  // DELETE EVENT
  const handleDelete = (id) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(`${API_URL}/api/events/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        setEvents((previousEvents) =>
          previousEvents.filter(
            (event) => event.id !== id
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  // EDIT EVENT
  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  // EVENT UPDATED
  const handleEventUpdated = (updatedEvent) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === updatedEvent.id
          ? updatedEvent
          : event
      )
    );

    setEditingEvent(null);
  };

  return (
    <div className="App">

      <nav>

        <h2>
          Daydream ✨
        </h2>

        <div>

          <button onClick={handleLogout}>
            Logout
          </button>

          {" | "}

          <Link to="/register">
            Register
          </Link>

        </div>

      </nav>

      <h1>
        Your Upcoming Moments
      </h1>

      <AddEvent
        onEventAdded={handleEventAdded}
      />

      {editingEvent && (
        <EditEvent
          event={editingEvent}
          onEventUpdated={handleEventUpdated}
          onCancel={() => setEditingEvent(null)}
        />
      )}

      <div className="events-container">

        {events.length === 0 ? (
          <p>
            You don't have any events yet.
          </p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}

      </div>

    </div>
  );
}

export default Dashboard;