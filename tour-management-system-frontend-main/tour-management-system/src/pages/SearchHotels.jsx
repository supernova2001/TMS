import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/search-hotels.css";

const SearchHotels = () => {
  const [exploreCity, setExploreCity] = useState({});
  const [hotelSearch, setHotelSearch] = useState("");
  const [allHotels, setAllHotels] = useState([]);
  const [hotelByName, setHotelByName] = useState([]);
  const [hotelByCurrentFilter, setHotelByCurrentFilter] = useState([]);
  const [priceFilters, setPriceFilters] = useState({
    '200': false,
    '300': false,
    '400': false,
  });
  const [starsFilters, setStarsFilters] = useState({
    '3': false,
    '4': false,
    '5': false,
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCity = searchParams.get("city");

  useEffect(() => {
    const fetchCity = async () => {
      if (selectedCity) {
        try {
          const response = await fetch(
            `http://localhost:4000/search-place/placename?p=${selectedCity}`,
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

    fetchCity();
  }, [selectedCity]);

  const getAllHotels = async () => {
    try {
      const response = await fetch(`http://localhost:4000/search-accommodation/place?city=${selectedCity}`,       
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAllHotels(data);
        setHotelByCurrentFilter(data);
        return data;
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      throw error;
    }
  };

  const filterHotelsByName = () => {
    const searchQuery = hotelSearch.toLowerCase();
    const filtered = allHotels.filter((hotel) => {
      return (
        hotel.name.toLowerCase().includes(searchQuery) 
      );
    });
    setHotelByName(filtered);
    setHotelByCurrentFilter(filtered);
  };

  const filterHotelsByPriceAndStars = (priceFilters, starsFilters) => {
    const selectedPrices = Object.keys(priceFilters).filter(
      (key) => priceFilters[key]
    );
    const selectedStars = Object.keys(starsFilters).filter(
      (key) => starsFilters[key]
    );

    const hotelsByPriceAndStars = allHotels.filter((hotel) => {
      const hotelPrice = parseInt(hotel.price, 10);
      const hotelStars = parseInt(hotel.stars, 10);
    
      const priceMatched = selectedPrices.every((selectedPrice) => {
        const parsedSelectedPrice = parseInt(selectedPrice, 10);
        return hotelPrice < parsedSelectedPrice;
      });
    
      const starsMatched = selectedStars.every((selectedStars) => {
        const parsedSelectedStars = parseInt(selectedStars, 10);
        return hotelStars >= parsedSelectedStars;
      });
    
      if (priceMatched && starsMatched) {
        return true;
      }
      return false;
    });
    const combinedMatchedHotels = hotelsByPriceAndStars.map((hotel) => hotel.name);
    setHotelByCurrentFilter(hotelsByPriceAndStars);
  };    

  const handleFilterChange = (filterType, filter) => {
    if (filterType === "price") {
      console.log("price filter changed");
      setPriceFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          [filter]: !prevFilters[filter],
        };
        console.log(updatedFilters);
        filterHotelsByPriceAndStars(updatedFilters, starsFilters);
        return updatedFilters;
      });
      
    } else if (filterType === "stars") {
      setStarsFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          [filter]: !prevFilters[filter],
        };
  
        filterHotelsByPriceAndStars(priceFilters, updatedFilters);
        return updatedFilters;
      });
    }
  };


  useEffect(() => {
    getAllHotels(); 
  }, []);


  return (
    <div className="container">
      <h1 className="title">Search for hotels in {exploreCity.place_name}:</h1>

      <div className="search-section">
        <input
          type="text"
          className="search-box"
          placeholder="Search for hotels by name"
          value={hotelSearch}
          onChange={(e) => setHotelSearch(e.target.value)}
        />
        <button className="search-button" onClick={filterHotelsByName}>
          Search Hotels
        </button>
      </div>

      <div className="filters">
        <div>
          <p>Price Filter:</p>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("price","200")}
              checked={priceFilters.price200}
            />
            &lt; $200
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("price","300")}
              checked={priceFilters.price300}
            />
            &lt; $300
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("price","400")}
              checked={priceFilters.price400}
            />
            &lt; $400
          </label>
        </div>
        <div>
          <p>Stars Filter:</p>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("stars","3")}
              checked={starsFilters.stars3}
            />
            3+
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("stars","4")}
              checked={starsFilters.stars4}
            />
            4+
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFilterChange("stars","5")}
              checked={starsFilters.stars5}
            />
            5+
          </label>
        </div>
      </div>

      <div className="hotel-results">
        <h1>Hotel Results:</h1>
        {hotelByCurrentFilter.map((hotel, index) => (
          <div key={index} className="hotel-container">
            <Link to={`/hotel?hotelname=${hotel.name}`}>
              <button>{hotel.name}</button>
            </Link>
          </div>
        ))}
      </div>
    </div> 
  );
};

export default SearchHotels;