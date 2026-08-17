import { useState } from "react";

function EditEvent({
  event,
  onEventUpdated,
  onCancel,
}) {

  const [title, setTitle] = useState(
    event.title
  );

  const [targetDate, setTargetDate] =
    useState(
      event.target_date
        ? event.target_date.slice(0, 16)
        : ""
    );

  const [error, setError] =
    useState("");


  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");


    // Get logged-in user
    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {

      setError(
        "Please login again."
      );

      return;

    }


    const user =
      JSON.parse(storedUser);


    if (!user.token) {

      setError(
        "Authentication token missing."
      );

      return;

    }


    const updatedData = {

      title: title,

      target_date: targetDate,

    };


    fetch(
      `http://127.0.0.1:8000/api/events/${event.id}/`,
      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Token ${user.token}`,

        },

        body:
          JSON.stringify(updatedData),

      }
    )

      .then((response) => {

        if (response.status === 401) {

          throw new Error(
            "Authentication failed. Please login again."
          );

        }


        if (response.status === 404) {

          throw new Error(
            "Event not found."
          );

        }


        if (!response.ok) {

          throw new Error(
            "Failed to update event."
          );

        }


        return response.json();

      })

      .then((data) => {

        console.log(
          "Event updated:",
          data
        );


        onEventUpdated(data);

      })

      .catch((error) => {

        console.error(
          "Error updating event:",
          error
        );

        setError(
          error.message
        );

      });

  };


  return (

    <div className="edit-event">

      <h2>
        Edit Event
      </h2>


      <form
        onSubmit={handleSubmit}
      >

        <input

          type="text"

          placeholder="Event name"

          value={title}

          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }

          required

        />


        <input

          type="datetime-local"

          value={targetDate}

          onChange={(e) =>
            setTargetDate(
              e.target.value
            )
          }

          required

        />


        <div>

          <button type="submit">
            Save Changes
          </button>


          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

        </div>


        {error && (

          <p>
            {error}
          </p>

        )}

      </form>

    </div>

  );

}


export default EditEvent;