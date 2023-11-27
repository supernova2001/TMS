import React from "react";
import "../styles/about.css";

const About = () => {
    return (
        <div className="about-container">
          <div className="header">
            <h1>Thanks for visiting our Tour Management System site!</h1>
          </div>
          <div className="paragraphs">
            <div className="paragraph">
              <h2>Step 1</h2>
              <p>Visit our home page and search for the city you would like to travel to. Once you select a city, 
                you will be brought to an explore page for that place.</p>
            </div>
            <div className="paragraph">
              <h2>Step 2</h2>
              <p>On the explore page, you will be able to see images of the city you have selected and can find
                hotels and flights for your vacation. </p>
            </div>
            <div className="paragraph">
              <h2>Step 3</h2>
              <p>Once you find you preferred accomodations, you can book directly on our site! You can view your
                upcoming itinerary on our Tours page.</p>
            </div>
          </div>
        </div>
      );
};

export default About;
