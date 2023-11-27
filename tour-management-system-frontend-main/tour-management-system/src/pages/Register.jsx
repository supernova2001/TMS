import React, { useState } from "react";
import { Button, Row, Col, Form, Container, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import loginimage from "../assets/images/loginimage.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
    question1: undefined,
    question2: undefined,
  });

  const [qrcodeUrl, setQrCodeUrl] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [twoFactorSecret, settwoFactorSecret] = useState("");

  const handlechange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleclick = async (e) => {
    e.preventDefault();
    console.log(credentials);

    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        name: credentials.username,
        email: credentials.email,
        password: credentials.password,
        phone: credentials.phone,
        securityquestion1: credentials.question1,
        securityquestion2: credentials.question2
      });
      console.log(response)
      if (response.data.qrCodeImageUrl) {
        setQrCodeUrl(response.data.qrCodeImageUrl);
        setRegistrationComplete(true);
        settwoFactorSecret(response.data.secretcode);
      }
    
    }catch(err){
      console.log(err);
    }
  };
  
  return (
    <section>
      <Container>
        {qrcodeUrl? (<div>
          <h1>QR Code</h1>
          <img src={qrcodeUrl} alt="QR Code" />
          <p>Use the secret code to manually add the application: {twoFactorSecret}</p>
          <a href="/login">Go back to Login</a>
        </div>):(<Row>
          {/* <Col lg="8" className="m-auto"> */}
          <div className="login__container d-flex justify-content-between">
            <div className="login__image">
              <img src={loginimage} alt="" />
            </div>
            <div className="login__form">
              <h2>Register</h2>
              <Form className="form" onSubmit={handleclick}>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    id="username"
                    onChange={handlechange}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    id="email"
                    onChange={handlechange}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    id="password"
                    onChange={handlechange}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Phone"
                    required
                    id="phone"
                    onChange={handlechange}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Where was your first job?"
                    required
                    id="question1"
                    onChange={handlechange}
                  />
                </FormGroup>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Who is your favorite author?"
                    required
                    id="question2"
                    onChange={handlechange}
                  />
                </FormGroup>
                <Button
                  className="btn secondary__btn auth__btn rounded-circle"
                  type="submit"
                >
                  Register
                </Button>
              </Form>
              <p>
                Already have an account? <Link to="/login"> LogIn </Link>
              </p>
            </div>
          </div>
          {/* </Col> */}
        </Row>)}
      </Container>
    </section>
  );
};

export default Register;