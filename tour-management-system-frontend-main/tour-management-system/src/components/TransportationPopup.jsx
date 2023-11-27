import React, { useState } from "react";
import PropTypes from "prop-types";

const TransportationPopup = ({ onClose, onSubmit, selectedTransportation }) => {
  const [numTravelersPopup, setNumTravelersPopup] = useState(1);
  const [departureDatePopup, setDepartureDatePopup] = useState("");
  const [returnDatePopup, setReturnDatePopup] = useState("");

  const handleNumTravelersChangePopup = (event) => {
    setNumTravelersPopup(event.target.value);
  };

  const handleDepartureDateChangePopup = (event) => {
    setDepartureDatePopup(event.target.value);
  };

  const handleReturnDateChangePopup = (event) => {
    setReturnDatePopup(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      numTravelers: numTravelersPopup,
      departureDate: departureDatePopup,
      returnDate: returnDatePopup,
    });
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Enter details: </h2>
        <label htmlFor="numTravelersPopup">Number of Travelers:</label>
        <input
          type="number"
          id="numTravelersPopup"
          value={numTravelersPopup}
          onChange={handleNumTravelersChangePopup}
        />
        <label htmlFor="departureDatePopup">Departure Date:</label>
        <input
          type="date"
          id="departureDatePopup"
          value={departureDatePopup}
          onChange={handleDepartureDateChangePopup}
        />
        <label htmlFor="returnDatePopup">Return Date:</label>
        <input
          type="date"
          id="returnDatePopup"
          value={returnDatePopup}
          onChange={handleReturnDateChangePopup}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

TransportationPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedTransportation: PropTypes.object.isRequired,
};

export default TransportationPopup;
