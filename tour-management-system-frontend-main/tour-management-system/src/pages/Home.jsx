import React, { useState, useEffect } from "react";
import "../styles/home.css";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleCitySelection = (city) => {
    fetch(`http://localhost:4000/search-place/placename?p=${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/explore?city=${encodeURIComponent(city)}`);
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error fetching city details:", error);
      });
  };
    
  useEffect(() => {
    const fetchSearchResults = async () => {
      setNoResults(false);

      const response = await fetch(
        `http://localhost:4000/search/autocomplete?q=${searchInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        if (data.length === 0) {
          setNoResults(true); 
        }
      } else {
        throw new Error("Network response was not ok");
      }
    };

    if (searchInput) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <Container>
      <h1 className="title">Start traveling with ease!</h1>
      <div className="centered">
        <input
          className="searchBar"
          type="text"
          placeholder="Search for a city..."
          onChange={handleChange}
          value={searchInput}
        />
      </div>
      <div className="results centered">
        {noResults ? (
          <p>No results found</p>
        ) : (
          <ul className="autocomplete">
            {searchResults.map((places, index) => (
              <li key={index}>
                <a
                  className="link-style"
                  onClick={() => handleCitySelection(places.place_name)}
                >
                  {places.place_name}, {places.state}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default Home;
