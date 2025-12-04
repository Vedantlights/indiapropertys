import React from 'react';
import SearchBar from '../components/SearchBar';
import Explore from '../components/Explore';
import PropertyCard, { sampleProperties } from '../components/PropertyCard';

const Home = () => {
  return (
    <div>
      <SearchBar />
      <Explore />

      <div className="featured-properties-section">
        <div className="featured-properties-container">
          <div className="featured-properties-header">
            <h2 className="featured-properties-title">Featured Properties</h2>
            <p className="featured-properties-subtitle">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <div className="property-cards-horizontal-container">
            {sampleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
