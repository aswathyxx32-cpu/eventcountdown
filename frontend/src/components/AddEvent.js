import { useState } from "react";

function AddEvent({ onEventAdded }) {

  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");


  const handleSubmit = (e) => {

    e.preventDefault();

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {

      alert("Please login first.");

      return;

    }


    const user =
      JSON.parse(storedUser);


    const newEvent = {

      title: title,

      target_date: targetDate,

    };


    fetch(
      "http://127.0.0.1:8000/api/events/",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Token ${user.token}`,

        },

        body:
          JSON.stringify(newEvent),

      }
    )

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to add event"
          );

        }

        return response.json();

      })

      .then((data) => {

        console.log(
          "Event added:",
          data
        );

        onEventAdded(data);

        setTitle("");

        setTargetDate("");

      })

      .catch((error) => {

        console.error(
          "Error adding event:",
          error
        );

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

    </form>

  );

}

export default AddEvent;