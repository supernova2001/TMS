import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import "../styles/itinerary.css";
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import mapmarker from "../assets/images/mapmarker.png";

const defaultHotelData = [
  {
    name: "Hotel Indiana",
    startDate: "2023-01-01",
    endDate: "2023-01-07",
    location: "Indiana",
    pricePerNight: 150,
    latitude: 39.7684,
    longitude: -86.1581
  },
  {
    name: "Hotel Chicago",
    startDate: "2023-01-01",
    endDate: "2023-01-07",
    location: "Chicago",
    pricePerNight: 150,
    latitude: 41.8781,
    longitude: -87.6298 
  }
];

const defaultTransportData = [
  {
    serviceName: "Uber",
    startDate: "2023-01-01",
    endDate: "2023-01-02",
    origin: "Bloomington Indiana",
    originLatitude: 39.7,
    originLongitude: -86.1,
    destination: "Chicago",
    price: 30
  },
  {
    serviceName: "Uber",
    startDate: "2023-02-01",
    endDate: "2023-02-02",
    origin: "Chicago",
    originLatitude:  39.7684,
    originLongitude: -87.6298,
    destination: "Bloomington Indiana",
    price: 30
  }
];

const Itinerary = ({ hotelData = defaultHotelData, transportData = defaultTransportData }) => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);

  const [dayPlan, setDayPlan] = useState(""); 
  const [loggedIn, setLoggedIn] = useState(true); // For debugging

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-86.1581, 39.7684]), // coordinates of Indiana
        zoom: 6
      })
    });
  
    const createFeature = (longitude, latitude) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude]))
      });
      feature.setStyle(new Style({
        image: new Icon({
          src: mapmarker,
          scale: 0.1
        })
      }));
      return feature;
    };
  
    if (loggedIn) {
      const features = hotelData.map(hotel => createFeature(hotel.longitude, hotel.latitude));
      const vectorSource = new VectorSource({ features });
      const vectorLayer = new VectorLayer({ source: vectorSource });
      map.addLayer(vectorLayer);
    }
  
    setMapInstance(map);
  
    return () => map.setTarget(undefined);
  }, [hotelData, loggedIn]);

  //Need to work with backend on this section

  useEffect(() => {
      const fetchhotelItinerary = async () => {
          if (loggedIn) {
              try {
                  const response = await fetch('http://localhost:4000/user/hotelitinerary');
                  if (response.status !== 200) throw new Error('Failed to fetch itinerary data');
                  const data = await response.json();
                  setDayPlan(data.itineraryDayPlan); 
              } catch (error) {
                  console.error("Error fetching itinerary:", error);
              }
          }
      };
      fetchhotelItinerary();
  }, [loggedIn]);

  useEffect(() => {
    const fetchtransportItinerary = async () => {
        if (loggedIn) {
            try {
                const response = await fetch('http://localhost:4000/user/transportitinerary');
                if (response.status !== 200) throw new Error('Failed to fetch itinerary data');
                const data = await response.json();
                setDayPlan(data.itineraryDayPlan); 
            } catch (error) {
                console.error("Error fetching itinerary:", error);
            }
        }
    };
    fetchtransportItinerary();
  }, [loggedIn]);

  const saveDayPlan = async () => {
      try {
          const response = await fetch('http://localhost:4000/user/hotelitinerary', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ itineraryDayPlan: dayPlan })
          });
          if (response.status !== 200) throw new Error('Failed to save itinerary');
      } catch (error) {
          console.error("Error saving itinerary:", error);
      }
  };

  useEffect(() => {
    const fetchItineraryDayPlan = async () => {
        if (loggedIn) {
            try {
                const response = await fetch('http://localhost:4000/user/itinerarydayplan');
                if (response.status !== 200) throw new Error('Failed to fetch itinerary data');
                const data = await response.json();
                setDayPlan(data.itineraryDayPlan); 
            } catch (error) {
                console.error("Error fetching itinerary plan:", error);
            }
        }
    };
    fetchItineraryDayPlan();
  }, [loggedIn]);

  useEffect(() => {
    if (mapInstance) {
        mapInstance.updateSize();
    }
  }, [mapInstance]);

  return (
    <div className="itinerary-container">

        <div className="top-section">

            <div className="left-content">
                <div ref={mapRef} className="map-container"></div>
            </div>

            <div className="right-content">

                {/* Hotel Column */}
                <div className="hotel-column">
                    <div className="column-header">
                        <h3>Your Booked Hotels</h3>
                        <p className="column-description">Details of your booked hotels are listed below.</p>
                    </div>
                    {loggedIn ? hotelData.map((hotel, idx) => (
                        <div
                            key={idx}
                            className="item-box"
                            onClick={() => {
                                if (mapInstance) {
                                    const view = mapInstance.getView();
                                    if (view) {
                                        view.animate({
                                            center: fromLonLat([hotel.longitude, hotel.latitude]),
                                            zoom: 10
                                        });
                                    }
                                }
                            }}
                        >
                            <h4>{hotel.name}</h4>
                            <p>Reservation: {hotel.startDate} - {hotel.endDate}</p>
                            <p>Location: {hotel.location}</p>
                            <p>Price: ${hotel.pricePerNight} / night</p>
                        </div>
                    )) : <p>Login To View Hotels</p>}
                </div>

                {/* Transport Column */}
                <div className="transport-column">
                    <div className="column-header">
                        <h3>Your Booked Transportation Services</h3>
                        <p className="column-description">Details of your transportation services are listed below.</p>
                    </div>
                    {loggedIn ? transportData.map((transport, idx) => (
                        <div
                            key={idx}
                            className="item-box"
                            onClick={() => {
                                if (mapInstance) {
                                    const view = mapInstance.getView();
                                    if (view) {
                                        if (transport.originLongitude && transport.originLatitude) {
                                            view.animate({
                                                center: fromLonLat([transport.originLongitude, transport.originLatitude]),
                                                zoom: 10
                                            });
                                        } else {
                                            view.animate({
                                                center: fromLonLat([-86.1581, 39.7684]),
                                                zoom: 10
                                            });
                                        }
                                    }
                                }
                            }}
                        >
                            <h4>{transport.serviceName}</h4>
                            <p>Dates: {transport.startDate} - {transport.endDate}</p>
                            <p>Origin: {transport.origin}</p>
                            <p>Destination: {transport.destination}</p>
                            <p>Price: ${transport.price}</p>
                        </div>
                    )) : <p>Login To View Transportation Services</p>}
                </div>

            </div>
        </div>

        {/* Day Plan Container*/}
        <div className="day-plan-container">
            {loggedIn ? (
                <>
                    <textarea
                        value={dayPlan}
                        onChange={(e) => setDayPlan(e.target.value)}
                        placeholder="Enter your itinerary day plan here..."
                    />
                    <button onClick={saveDayPlan}>Save</button>
                </>
            ) : (
                <p>Login To View and Edit Itinerary</p>
            )}
        </div>
    </div>
);

};

export default Itinerary;