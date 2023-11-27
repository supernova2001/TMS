import React, { useState, useEffect } from "react";
import "../styles/hotel.css";  
//import { BASE_URL } from "../utils/config";
import loginimage from "../assets/images/loginimage.png";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

//Place holder hotel data structure
const defaultHotel = {
    _id: "123456789",
    hotel_name: "Loading...",
    country: "Loading...",
    state: "Loading...",
    city: "Loading...",
    address: "Loading...",
    zipcode: "Loading...",
    info: "Loading...", // Description of the place such as activities 
    price: 100,
    rating: 0,
    reviewIds: [],
    images: [] // Placeholder for image paths
};

//Place holder review data structure
const exampleReview = {
    _id: "123456789",
    reviewDescription: "Loading...",
    rating: 5
};

const Hotel = () => {
    
    const [hotel, setHotel] = useState(defaultHotel);
    const [reviews, setReviews] = useState(Array(5).fill(exampleReview));
    const [showBookingOptions, setShowBookingOptions] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);

    const navigate = useNavigate(); 

    const handleBooking = () => {
        if(hotel.hotel_name !== "Loading...") {
            navigate(`/Bookhotel?name=${hotel.hotel_name}`);
        } else {
            alert("Please select a valid hotel location.");
        }
    };

    const calculatePrice = () => {
        if (!startDate || !endDate) {
            return null;
        }
        const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        return days > 0 ? days * hotel.price * numberOfTravelers : null;
    };

    const handleConfirmBooking = async () => {
        const bookingData = {
            startdate: startDate,
            enddate: endDate,
            price: calculatePrice(),
            numerOfTravelers: numberOfTravelers
        };

        try {
            const response = await fetch(`http://localhost:4000/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            if (response.status === 200) {
                alert("Booking confirmed!");
                setShowBookingOptions(false); 
            } else {
                alert("Error in booking. Please try again.");
            }
        } catch (error) {
            console.error("Error while booking:", error);
            alert("Error in booking. Please try again.");
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:4000/hotel/${hotel._id}/reviews`);
            if (response.status !== 200) throw new Error("Failed to fetch reviews");
            const data = await response.json();
            if(data && data.length > 0) {
                setReviews(prevReviews => [...prevReviews, ...data]); 
            } else {
                setReviews(prevReviews => [...prevReviews, ...Array(5).fill(exampleReview)]); 
            }
        } catch (error) {
            console.error("Error fetching Hotel reviews:", error);
            setReviews(prevReviews => [...prevReviews, ...Array(5).fill(exampleReview)]); 
        }
    };

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                // Get the search parameters from the URL
                const url = new URL(window.location.href);
                const searchParams = new URLSearchParams(url.search);
                const inputHotel = searchParams.get("p");
    
                if (inputHotel) {
                    const response = await fetch(`http://localhost:4000/hotel/hotelname?p=${inputHotel}`);
                    if (response.status !== 200) throw new Error("Hotel not found");
                    const data = await response.json();
                    setHotel(data);
                } else {
                    setHotel(defaultHotel);
                }
            } catch (error) {
                console.error("Error fetching Hotel details:", error);
                setHotel(defaultHotel);
            }
        };
    
        fetchHotelData();
    }, []);

    return (
        <section className="hotel-container">
            <h2>{hotel.name}</h2>

            <div className="hotel-image">
                {(!hotel.images || hotel.images.length === 0) ? (
                    <img src={loginimage} alt="Default" />
                ) : (
                    hotel.images.map((img, index) => <img key={index} src={img} alt={``} />)
                )}
            </div>

            <div className="hotel-details description">
                <h3>Description</h3>
                <p><strong>Name:</strong> {hotel.hotel_name}</p>
                <p><strong>Rating:</strong> {hotel.rating}</p>
                <p><strong>Info:</strong> {hotel.information}</p>
            </div>

            <div className="hotel-details address">
                <h3>Address</h3>
                <p><strong>Country:</strong> {hotel.country}</p>
                <p><strong>State:</strong> {hotel.state}</p>
                <p><strong>City:</strong> {hotel.city}</p>
                <p><strong>Address:</strong> {hotel.address}, {hotel.zipcode}</p>

                <Button 
                    className="btn secondary__btn auth__btn" 
                    onClick={() => setShowBookingOptions(true)}
                    style={{ display: showBookingOptions ? 'none' : 'block' }} 
                >
                    Book Now
                </Button>
                
                {showBookingOptions && (
                    <div className="booking-options">
                        <h3>Booking Details:</h3>
                        <label>Start Date:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label>End Date:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <label>Number of Travelers:</label>
                        <input type="number" value={numberOfTravelers} onChange={(e) => setNumberOfTravelers(Number(e.target.value))} min="1" />
                        {calculatePrice() !== null ? (
                            <p>Total Price: ${calculatePrice()}</p>
                        ) : (
                            <p>Please select a valid date range</p>
                        )}
                        <Button onClick={handleConfirmBooking}>Confirm</Button>
                    </div>
                )}
            </div>

            <div className="hotel-details reviews">
                <h3>Reviews</h3>
                <Button onClick={fetchReviews} className="btn secondary__btn auth__btn">Load Reviews</Button>
                {
                    reviews.map((review, index) => (
                        <div key={index}>
                            <p><strong>Rating:</strong> {review.rating}</p>
                            <p>{review.reviewDescription}</p>
                        </div>
                      ))
                }
            </div>
        </section>
    );
};

export default Hotel;
