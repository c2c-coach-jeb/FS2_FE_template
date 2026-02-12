import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  // Lesson 9 TODO: Step 1 – Collect the form data in component state so it can be sent to your server.
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
  });

  // Lesson 9 TODO: Step 2 – Send this data to your Express endpoint once it's implemented.
  // Lesson 9 TODO: Step 3 – Handle both success and failure responses from the server.
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      // Reminder: set REACT_APP_API_BASE_URL in your .env once your Express server is up.
      .post(`${process.env.REACT_APP_API_BASE_URL}/contact`, formData)
      .then((response) => {
        console.log(response.data);
        // TODO: replace this console.log with user feedback once the POST route is working.
      })
      .catch((error) => {
        console.log(error);
        // TODO: surface an error message to the user once the POST route is working.
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div id="contact">
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          className="name"
          id="fname"
          name="firstname"
          placeholder="Your name.."
          value={formData.firstname}
          onChange={handleInputChange}
        />

        <label htmlFor="lname">Last Name</label>
        <input
          type="text"
          className="name"
          id="lname"
          name="lastname"
          placeholder="Your last name.."
          value={formData.lastname}
          onChange={handleInputChange}
        />

        <label htmlFor="email">Email Address</label>
        <textarea
          id="email"
          name="email"
          placeholder="Please leave an email address where we can reach you"
          value={formData.email}
          onChange={handleInputChange}
        />

        <label htmlFor="subject">Subject</label>
        <textarea
          id="subject"
          name="subject"
          placeholder="Write something.."
          value={formData.subject}
          onChange={handleInputChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
