import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropertyCard, { ALL_PROPERTIES } from '../components/PropertyCard';
import '../styles/SearchResults.css';
import SearchBar from'../components/SearchBar'; 


const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    type: '',
    budget: '',
    bedrooms: ''
  });

  const isInBudgetRange = (price, budgetRange, status) => {
    // Convert budget range string to min/max values
    const ranges = {
      '0-25L': { min: 0, max: 2500000 },
      '25L-50L': { min: 2500000, max: 5000000 },
      '50L-75L': { min: 5000000, max: 7500000 },
      '75L-1Cr': { min: 7500000, max: 10000000 },
      '1Cr-2Cr': { min: 10000000, max: 20000000 },
      '2Cr+': { min: 20000000, max: Infinity }
    };

    const range = ranges[budgetRange];
    if (!range) return true;

    // For rental properties, convert monthly rent to approximate annual value for comparison
    const comparePrice = status === 'For Rent' ? price * 12 : price;
    
    return comparePrice >= range.min && comparePrice <= range.max;
  };

  // 1. Use useCallback to stabilize the filterProperties function
  const filterProperties = useCallback((location, type, budget, bedrooms) => {
    let results = [...ALL_PROPERTIES];

    // Filter by location (case-insensitive, partial match)
    if (location) {
      results = results.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by property type
    if (type) {
      results = results.filter(property => 
        property.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by budget range
    if (budget) {
      results = results.filter(property => {
        const price = property.price;
        // isInBudgetRange is stable (no dependencies) so we don't need to put it in useCallback deps
        return isInBudgetRange(price, budget, property.status);
      });
    }

    // Filter by bedrooms
    if (bedrooms) {
      const bedroomCount = bedrooms === '5+' ? 5 : parseInt(bedrooms);
      results = results.filter(property => {
        if (bedrooms === '5+') {
          return property.bedrooms >= bedroomCount;
        }
        return property.bedrooms === bedroomCount;
      });
    }

    return results;
  }, []); // Empty dependency array because it only uses fixed variables (ALL_PROPERTIES) and a stable function (isInBudgetRange).

  useEffect(() => {
    // Get filter values from URL params
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const budget = searchParams.get('budget') || '';
    const bedrooms = searchParams.get('bedrooms') || '';

    setActiveFilters({ location, type, budget, bedrooms });

    // Filter properties based on criteria
    // 2. filterProperties is now included in the dependency array
    const filtered = filterProperties(location, type, budget, bedrooms);
    setFilteredProperties(filtered);
  }, [searchParams, filterProperties]); // 3. Dependency 'filterProperties' is now included, and the warning is resolved.

  
  const clearAllFilters = () => {
    navigate('/search');
    setActiveFilters({ location: '', type: '', budget: '', bedrooms: '' });
  };

  const removeFilter = (filterName) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterName);
    navigate(`/search?${newParams.toString()}`);
  };
  
  // Function to navigate back
  const handleGoBack = () => {
    navigate(-1);
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  return (
    <div className="buyer-search-results-page">
      {/* Results Header */}
      <div className="buyer-results-header">
        <div className="buyer-results-header-content">
          {/* Back Button added here */}
          <button 
            onClick={handleGoBack} 
            className="buyer-back-button"
            style={{
              background: 'none',
              border: 'none',
              color: '#1e3a8a',
              fontSize: '1.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '1rem',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            title="Go back to the previous page"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              style={{ marginRight: '0.5rem' }}
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            
          </button>
          {/* End Back Button */}

          <SearchBar/>
          
          <h1 className="buyer-results-title">Search Results</h1>
          <p className="buyer-results-count">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="buyer-active-filters">
            <span className="buyer-filters-label">Active Filters:</span>
            <div className="buyer-filter-tags">
              {activeFilters.location && (
                <div className="buyer-filter-tag">
                  <span>Location: {activeFilters.location}</span>
                  <button onClick={() => removeFilter('location')} className="buyer-remove-filter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
              {activeFilters.type && (
                <div className="buyer-filter-tag">
                  <span>Type: {activeFilters.type}</span>
                  <button onClick={() => removeFilter('type')} className="buyer-remove-filter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
              {activeFilters.budget && (
                <div className="buyer-filter-tag">
                  <span>Budget: {activeFilters.budget}</span>
                  <button onClick={() => removeFilter('budget')} className="buyer-remove-filter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
              {activeFilters.bedrooms && (
                <div className="buyer-filter-tag">
                  <span>Bedrooms: {activeFilters.bedrooms} BHK</span>
                  <button onClick={() => removeFilter('bedrooms')} className="buyer-remove-filter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
              <button onClick={clearAllFilters} className="buyer-clear-all-btn">
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Content */}
      <div className="buyer-results-content">
        {filteredProperties.length > 0 ? (
          <div className="buyer-results-grid">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="buyer-no-results">
            <svg 
              width="100" 
              height="100" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#cbd5e0" 
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No Properties Found</h3>
            <p>We couldn't find any properties matching your search criteria.</p>
            <div className="buyer-no-results-actions">
              <button onClick={clearAllFilters} className="buyer-try-again-btn">
                Clear Filters & Try Again
              </button>
              <button onClick={() => navigate('/')} className="buyer-go-home-btn">
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;