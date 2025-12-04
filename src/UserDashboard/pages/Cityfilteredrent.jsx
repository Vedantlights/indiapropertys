import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { ALL_PROPERTIES } from '../components/PropertyCard';
import '../styles/Filteredproperties.css';
import '../styles/SearchBar.css';

const CityFilteredRent = () => {

  window.scrollTo(0,0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cityParam = searchParams.get('city');
  const [filteredProperties, setFilteredProperties] = useState([]);

  // SearchBar state
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    budget: '',
    bedrooms: ''
  });

  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial',"PG / Hostel","Independent House","Row House","Bungalow","Studio Apartment","Penthouse","Farm House","Industrial N/A Land ","Plot / Land","Commercial Office","Commercial Shop","Retail Space","Co-working Space","Warehouse / Godown","Industrial Property","Hotel / Guest House",];
  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const budgetRanges = [
    '0-25K',
    '25K-50K',
    '50K-75K',
    '75K-1L',
    '1L+',
  ];

  const topCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Jaipur',
    'Surat'
  ];

 // Top cities data for projects
  const projectCities = [ 
    { name: "Mumbai", icon: "🏙️" },
    { name: "Delhi", icon: "🏛️" },
    { name: "Bangalore", icon: "🌆" },
    { name: "Hyderabad", icon: "🏢" },
    { name: "Chennai", icon: "🌴" },
    { name: "Pune", icon: "🎓" },
    { name: "Kolkata", icon: "🎭" },
    { name: "Ahmedabad", icon: "🕌" },
  ];

  const handleProjectsClick = (city) => {
     window.scrollTo(0,0);
    navigate(`/projects?city=${city}`);
  };

  // SearchBar handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (searchData.location) queryParams.append('location', searchData.location);
    if (searchData.propertyType) queryParams.append('type', searchData.propertyType);
    if (searchData.budget) queryParams.append('budget', searchData.budget);
    if (searchData.bedrooms) queryParams.append('bedrooms', searchData.bedrooms);
    
    // Navigate to search results page
    navigate(`/search?${queryParams.toString()}`);
  };

  const handleQuickSearch = (city) => {
    navigate(`/search?location=${city}`);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    if (cityParam) {
      // Filter properties for rent in the selected city
      const filtered = ALL_PROPERTIES.filter(
        (property) =>
          property.status === 'For Rent' &&
          property.location.includes(cityParam)
      );
      setFilteredProperties(filtered);
    } else {
      // Show all properties for rent if no city is selected
      const allForRent = ALL_PROPERTIES.filter(
        (property) => property.status === 'For Rent'
      );
      setFilteredProperties(allForRent);
    }
  }, [cityParam]);

  return (
    <div className="buyer-filtered-properties-page">
      {/* ========== SEARCH BAR WITH BACK BUTTON - START ========== */}
      <div className="buyer-search-bar-container">
        <div className="buyer-search-bar-wrapper">
          {/* Back Button */}
          <button onClick={handleBackClick} className="buyer-search-back-button">
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
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>

          <h2 className="buyer-search-title">Find Your Dream Property</h2>
          <p className="buyer-search-subtitle">Search from thousands of verified properties across India</p>
          
          <form className="buyer-search-form" onSubmit={handleSearch}>
            <div className="buyer-search-inputs">
              {/* Location Input */}
              <div className="buyer-search-field">
                <label htmlFor="location" className="buyer-search-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City / Locality"
                  value={searchData.location}
                  onChange={handleInputChange}
                  className="buyer-search-input"
                />
              </div>

              {/* Property Type */}
              <div className="buyer-search-field">
                <label htmlFor="propertyType" className="buyer-search-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={searchData.propertyType}
                  onChange={handleInputChange}
                  className="buyer-search-select"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="buyer-search-field">
                <label htmlFor="budget" className="buyer-search-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={searchData.budget}
                  onChange={handleInputChange}
                  className="buyer-search-select"
                >
                  <option value="">Any Budget</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="buyer-search-field">
                <label htmlFor="bedrooms" className="buyer-search-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={searchData.bedrooms}
                  onChange={handleInputChange}
                  className="buyer-search-select"
                >
                  <option value="">Any</option>
                  {bedroomOptions.map(option => (
                    <option key={option} value={option}>{option} BHK</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="buyer-search-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>Search Properties</span>
            </button>
          </form>

          {/* Quick Search Cities */}
          <div className="buyer-quick-search">
            <span className="buyer-quick-search-label">Popular Cities:</span>
            <div className="buyer-quick-search-buttons">
              {topCities.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleQuickSearch(city)}
                  className="buyer-quick-search-btn"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ========== SEARCH BAR WITH BACK BUTTON - END ========== */}

      <div className="buyer-filtered-header">
        <h1>
          {cityParam ? `Properties for Rent in ${cityParam}` : 'All Properties for Rent'}
        </h1>
        <p className="buyer-filtered-count">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="buyer-filtered-properties-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="buyer-no-properties">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
          <h2>No Properties Found</h2>
          <p>
            {cityParam
              ? `We couldn't find any properties for rent in ${cityParam} at the moment.`
              : 'No properties available for rent.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CityFilteredRent;