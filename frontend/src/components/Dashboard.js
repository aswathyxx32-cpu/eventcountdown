import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EventCard from "./EventCard";
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";


function Dashboard() {

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const navigate = useNavigate();


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==========================================
  // LOAD EVENTS
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    // No user
    if (!storedUser) {

      navigate("/login");

      return;

    }


    const user =
      JSON.parse(storedUser);


    // No token
    if (!user.token) {

      localStorage.removeItem("user");

      navigate("/login");

      return;

    }


    fetch(
      "http://127.0.0.1:8000/api/events/",
      {
        headers: {

          "Authorization":
            `Token ${user.token}`,

        },

      }
    )

      .then((response) => {

        if (response.status === 401) {

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          throw new Error(
            "Authentication failed"
          );

        }


        if (!response.ok) {

          throw new Error(
            "Failed to fetch events"
          );

        }


        return response.json();

      })

      .then((data) => {

        console.log(
          "EVENTS:",
          data
        );

        setEvents(data);

      })

      .catch((error) => {

        console.error(
          "Error fetching events:",
          error
        );

      });

  }, [navigate]);


  // ==========================================
  // ADD EVENT
  // ==========================================

  const handleEventAdded = (
    newEvent
  ) => {

    setEvents(
      (previousEvents) => [
        ...previousEvents,
        newEvent,
      ]
    );

  };


  // ==========================================
  // DELETE EVENT
  // ==========================================

  const handleDelete = (id) => {

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {

      navigate("/login");

      return;

    }


    const user =
      JSON.parse(storedUser);


    fetch(
      `http://127.0.0.1:8000/api/events/${id}/`,
      {
        method: "DELETE",

        headers: {

          "Authorization":
            `Token ${user.token}`,

        },

      }
    )

      .then((response) => {

        if (response.status === 401) {

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;

        }


        if (response.ok) {

          setEvents(
            (previousEvents) =>
              previousEvents.filter(
                (event) =>
                  event.id !== id
              )
          );

        }

      })

      .catch((error) => {

        console.error(
          "Error deleting event:",
          error
        );

      });

  };


  // ==========================================
  // EDIT EVENT
  // ==========================================

  const handleEdit = (event) => {

    setEditingEvent(event);

  };


  // ==========================================
  // UPDATED EVENT
  // ==========================================

  const handleEventUpdated = (
    updatedEvent
  ) => {

    setEvents(
      (previousEvents) =>
        previousEvents.map(
          (event) =>
            event.id ===
            updatedEvent.id
              ? updatedEvent
              : event
        )
    );

    setEditingEvent(null);

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="App">


      {/* NAVIGATION */}

      <nav>

        <h2>
          Event Countdown
        </h2>


        <button
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* TITLE */}

      <h1>
        My Upcoming Events
      </h1>


      {/* ADD EVENT */}

      <AddEvent
        onEventAdded={
          handleEventAdded
        }
      />


      {/* EDIT EVENT */}

      {editingEvent && (

        <EditEvent

          event={editingEvent}

          onEventUpdated={
            handleEventUpdated
          }

          onCancel={() =>
            setEditingEvent(null)
          }

        />

      )}


      {/* EVENTS */}

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

              onDelete={
                handleDelete
              }

              onEdit={
                handleEdit
              }

            />

          ))

        )}

      </div>

    </div>

  );

}


export default Dashboard;