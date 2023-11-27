import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/search-transportation.css"; 
import axios from 'axios';
import TransportationPopup from "../components/TransportationPopup";

const SearchTransportation = () => {
  const [exploreCity, setExploreCity] = useState({});
  const [transportationData, setTransportationData] = useState([]);
  //const [departureCities, setDepartureCities] = useState([]);
  const [departureCities, setDepartureCities] = useState([
    'San Francisco',
    'San Diego',
    "Chicago",
    'Indianapolis',
    'Los Angeles',
    'Las Vegas',
    'New York City',
  ]); 
  const [departureCity, setDepartureCity] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const destinationCity = searchParams.get("city");
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    const fetchDestinationCity = async () => {
      if (destinationCity) {
        try {
          const response = await fetch(
            `http://localhost:4000/search-place/placename?p=${destinationCity}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setExploreCity(data[0]);
          } else {
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          console.error("Error fetching city data:", error);
        }
      }
    };

    fetchDestinationCity();
  }, [destinationCity]);

  const handleDepartureCityChange = (event) => {
    const selectedCity = event.target.value;
    setDepartureCity(selectedCity);
    setShowPopup(false);
  };

  const handleResultClick = (item) => {
    setSelectedTransportation(item);
    setShowPopup(true);
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const handlePopupSubmit = async ({ numTravelers, departureDate, returnDate }) => {
     // object id should be the uid of the post below
     // same for accommodation
    console.log("Submitted Data:", { numTravelers, departureDate, returnDate });
    try {
      const response = await axios.post("http://localhost:4000/", {
        num_travelers: numTravelers,
        departure_date: departureDate,
        return_date: returnDate
      });
      //console.log(response)
    
    }catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    filterTransportationData();
  }, [transportationData, departureCity]);


  const fetchTransportationData = async () => {
    // TODO:
    // fetch id for each object and then send with post request
    // fetch id for user and then send with post request
    try {
      const response = await fetch(`http://localhost:4000/search-mode/travelmode?city=${destinationCity}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransportationData(data);
        filterTransportationData();
        //console.log(data)
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error fetching transportation data:", error);
    }
  };

  const filterTransportationData = () => {
    if (departureCity && transportationData.length > 0) {
      const filteredData = transportationData.filter((item) => {
        return item.from_place === departureCity;
      });
      setTransportationData(filteredData);
    }
  };

  // user selects departure city, then get all results
  // user clicks on one of the results, pop up for entering number of travellers and dates
  // post request for sending that data to new database which will be used to add to itinerary
  // TODO: remove the destination city from the departure city list
  return (
    <div className="transportation-container">
      <h1 className="transportation-title">Find transportation to {exploreCity.place_name}:</h1>
      <div className="input-container">
        <div>
          <label htmlFor="departureCitySelect">Departure City:</label>
          <select
            id="departureCitySelect"
            value={departureCity}
            onChange={handleDepartureCityChange}
          >
            <option value="">Select Departure City</option>
            {departureCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>  
      </div> 
      <button className="search-button" onClick={fetchTransportationData}>
        Show Results
      </button>
      <div className="transportation-list">
        {transportationData.map((item) => (
          <div key={item._id} className="transportation-item" onClick={() => handleResultClick(item)}>
            <p>Mode: {item.mode}</p>
            <p>Arrival City: {item.to_place}</p>
            <p>Fare: ${item.fare}</p>
            <p>Dropoff Location: {item.arrival}</p>
            <p>Duration: {item.duration}</p>
            <p>Bus/Flight Number: {item.vehicle_number}</p>
            <p>Name: {item.name}</p>
            <p>Departure City: {item.from_place}</p>
            <button onClick={() => handleResultClick(item)}>Click here to Book</button>
          </div>
        ))}
      </div>
      {showPopup && (
        <TransportationPopup onClose={handleClosePopup} onSubmit={handlePopupSubmit} />
      )}
    </div>
  );
};

export default SearchTransportation;





