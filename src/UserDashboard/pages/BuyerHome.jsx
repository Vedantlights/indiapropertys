import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import UpcomingProjectCard from "../components/UpcomingProjectCard";
import PropertyCard from "../components/PropertyCard";
import { sampleProperties } from "../components/PropertyCard";
import "../styles/BuyerHome.css";

const Home = () => {
  window.scrollTo(0,0);
  const navigate = useNavigate();

  // Top cities data with background images
  const topCities = [
    { 
      name: "Mumbai", 
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80"
    },
    { 
      name: "Delhi", 
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80"
    },
    { 
      name: "Bangalore", 
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80"
    },
    { 
      name: "Hyderabad", 
      image: "https://images.unsplash.com/photo-1603262110267-d58cf800a49e?w=800&q=80"
    },
    { 
      name: "Chennai", 
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80"
    },
    { 
      name: "Pune", 
      image: "https://images.unsplash.com/photo-1610519953839-c3ef2a8b8e5e?w=800&q=80"
    },
    { 
      name: "Kolkata", 
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80"
    },
    { 
      name: "Ahmedabad", 
      image: "https://images.unsplash.com/photo-1621422829620-dca23e14e3b5?w=800&q=80"
    },
  ];

  const handleProjectsClick = (city) => {
     window.scrollTo(0,0);
    navigate(`/projects?city=${city}`);
  };

  return (
    <div className="buyer-page-wrapper">
      {/* Search Bar */}
      <SearchBar />

      {/* Mixed Properties Section */}
      <div className="buyer-home-properties-section">
        <div className="buyer-section-header">
          <h1>Explore Properties</h1>
          <p>Buy or Rent — All in One Place</p>
        </div>

        <div className="buyer-horizontal-scroll-container">
          <div className="buyer-property-cards-wrapper">
            {sampleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Projects Section */}
      <UpcomingProjectCard />

      {/* SECTION: Browse Residential Projects in Top Cities */}
      <div className="buyer-city-projects-section">
        <div className="buyer-section-header">
          <h2>Browse Residential Projects in Top Cities</h2>
          <p>Explore premium residential projects across India</p>
        </div>

        <div className="buyer-city-projects-grid">
          {topCities.map((city) => (
            <div
              key={city.name}
              className="buyer-city-project-card"
              onClick={() => handleProjectsClick(city.name)}
              style={{ backgroundImage: `url(${city.image})` }}
            >
              <div className="buyer-city-project-overlay"></div>
              <div className="buyer-city-project-content">
                <h3 className="buyer-city-project-name">{city.name}</h3>
                <p className="buyer-city-project-subtitle">Explore Projects</p>
                <div className="buyer-city-project-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;