import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col, Form, Container, FormGroup } from "reactstrap";
import axios from 'axios'
import "../styles/recoverpassword.css";

function PasswordReset() {
  const {token} = useParams(); // Token received from URL query parameter
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    console.log(token)
    try {
      const response = await axios.post("http://localhost:4000/auth/reset-password", {
          token: token,
          newPassword: newPassword,
      });
      console.log(response)
      if (response.ok) {
        const data = response.data;
        setMessage(data.message);
      } else {
        const errorData = response.data.message;
        setMessage(errorData);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <div className="login__form">
      <form onSubmit={handlePasswordReset} className="recoverpassword_form">
      <input type="hidden" name="token" value={token} /> {/* Hidden input for the token */}
        <label htmlFor="new-password">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Button className="btn secondary__btn auth__btn rounded-circle" type="submit">Reset Password</Button>
      </form>
      </div>
      <div id="message">{message}</div>
    </div>
  );
}

export default PasswordReset;
