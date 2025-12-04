import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    budget: '',
    bedrooms: ''
  });

  const [errors, setErrors] = useState({});

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Independent House',
    'Row House',
    'Bungalow',
    'Studio Apartment',
    'Penthouse',
    'Farm House',
    'Plot / Land',
    'Commercial Office',
    'Commercial Shop',
    'Retail Space',
    'Co-working Space',
    'Warehouse / Godown',
    'Industrial Property',
    'Hotel / Guest House',
    'PG / Hostel'
  ];
  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const budgetRanges = [
    '0-25L',
    '25L-50L',
    '50L-75L',
    '75L-1Cr',
    '1Cr-2Cr',
    '2Cr+'
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!searchData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!searchData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    if (!searchData.budget) {
      newErrors.budget = 'Budget is required';
    }
    if (!searchData.bedrooms) {
      newErrors.bedrooms = 'Bedrooms is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }
    
    // Redirect to dashboard with search parameters
    const queryParams = new URLSearchParams();
    if (searchData.location) queryParams.append('location', searchData.location);
    if (searchData.propertyType) queryParams.append('type', searchData.propertyType);
    if (searchData.budget) queryParams.append('budget', searchData.budget);
    if (searchData.bedrooms) queryParams.append('bedrooms', searchData.bedrooms);
    
    navigate(`/dashboard?${queryParams.toString()}`);
  };

  const handleQuickSearch = (city) => {
    // For quick search, set the location and validate other fields
    const updatedSearchData = { ...searchData, location: city };
    
    // Check if other fields are filled
    const newErrors = {};
    if (!updatedSearchData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    if (!updatedSearchData.budget) {
      newErrors.budget = 'Budget is required';
    }
    if (!updatedSearchData.bedrooms) {
      newErrors.bedrooms = 'Bedrooms is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSearchData(updatedSearchData);
      // Scroll to form to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // All fields are filled, redirect to dashboard
    navigate(`/dashboard?location=${city}&type=${updatedSearchData.propertyType}&budget=${updatedSearchData.budget}&bedrooms=${updatedSearchData.bedrooms}`);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <h2 className="search-title">Find Your Dream Property</h2>
        <p className="search-subtitle">Search from thousands of verified properties across India</p>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-inputs">
            {/* Location Input */}
            <div className="search-field">
              <label htmlFor="location" className="search-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City / Locality"
                value={searchData.location}
                onChange={handleInputChange}
                className={`search-input ${errors.location ? 'error' : ''}`}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {/* Property Type */}
            <div className="search-field">
              <label htmlFor="propertyType" className="search-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Property Type *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={searchData.propertyType}
                onChange={handleInputChange}
                className={`search-select ${errors.propertyType ? 'error' : ''}`}
              >
                <option value="">Select Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.propertyType && <span className="error-message">{errors.propertyType}</span>}
            </div>

            {/* Budget Range */}
            <div className="search-field">
              <label htmlFor="budget" className="search-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Budget *
              </label>
              <select
                id="budget"
                name="budget"
                value={searchData.budget}
                onChange={handleInputChange}
                className={`search-select ${errors.budget ? 'error' : ''}`}
              >
                <option value="">Select Budget</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              {errors.budget && <span className="error-message">{errors.budget}</span>}
            </div>

            {/* Bedrooms */}
            <div className="search-field">
              <label htmlFor="bedrooms" className="search-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Bedrooms *
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={searchData.bedrooms}
                onChange={handleInputChange}
                className={`search-select ${errors.bedrooms ? 'error' : ''}`}
              >
                <option value="">Select Bedrooms</option>
                {bedroomOptions.map(option => (
                  <option key={option} value={option}>{option} BHK</option>
                ))}
              </select>
              {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
            </div>
          </div>

          {/* Search Button */}
          <button type="submit" className="search-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span>Search Properties</span>
          </button>
        </form>

        {/* Quick Search Cities with Images */}
        <div className="quick-search">
          <span className="quick-search-label">Popular Cities:</span>
          <div className="quick-search-buttons">
            {topCities.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => handleQuickSearch(city)}
                className="quick-search-btn-image"
              >
                <div className="city-image-wrapper">
                  <img 
                    src={`/${city}.png`} 
                    alt={city}
                    className="city-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="city-overlay"></div>
                </div>
                <span className="city-name">{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;