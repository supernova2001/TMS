import React, { useState } from "react";
import { Button, Row, Col, Form, Container, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/recoverpassword.css";
import axios from "axios"

const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/auth/password-recovery", {
        email: email,
        securityquestion1: securityQuestion1,
        securityquestion2: securityQuestion2,
      });

      if (response.data.success) {
        // Handle success, e.g., show a success message, redirect, etc.
        setMessage('Password recovery email sent successfully');

      } else {
        // Handle errors, e.g., show an error message
        setMessage('Failed to initiate password recovery');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Initiate Password Recovery</h2>
      <div className="login__form">
      <form onSubmit={handleSubmit} className="recoverpassword_form">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Security Question 1:</label>
          <input
            type="text"
            value={securityQuestion1}
            id="securityquestion1"
            onChange={(e) => setSecurityQuestion1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Security Question 2:</label>
          <input
            type="text"
            value={securityQuestion2}
            id="securityquestion2"
            onChange={(e) => setSecurityQuestion2(e.target.value)}
            required
          />
        </div>
        <div>
          <Button 
          className="btn secondary__btn auth__btn rounded-circle"
          type="submit">Submit </Button>
        </div>
      </form>
      <div id="message">{message}</div>
      </div>
    </div>
  );

}

export default PasswordRecoveryForm;

