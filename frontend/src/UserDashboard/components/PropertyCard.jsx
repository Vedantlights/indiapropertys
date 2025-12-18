import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/PropertyCard.css';

// --- Consolidated Property Data (For Sale, For Rent, and Home Page) ---

// Properties from Home.jsx
const homeProperties = [
  // PUNE Properties
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
    title: 'Luxury 3BHK Apartment',
    price: 8500000,
    location: 'Koregaon Park, Pune',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    type: 'Row House',
    status: 'For Sale'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    title: 'Modern Villa with Garden',
    price: 15000000,
    location: 'Baner, Pune',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: 'Villa',
    status: 'For Sale'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
    title: 'Cozy 2BHK Flat',
    price: 35000,
    location: 'Wakad, Pune',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    type: 'Apartment',
    status: 'For Rent'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
    title: 'Spacious 4BHK Penthouse',
    price: 25000000,
    location: 'Hinjewadi, Pune',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
    title: 'Premium Studio Apartment',
    price: 4500000,
    location: 'Viman Nagar, Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=500',
    title: 'Luxury 3BHK with Pool',
    price: 55000,
    location: 'Kharadi, Pune',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    type: 'Apartment',
    status: 'For Rent'
  },
  
  // MUMBAI Properties
  {
    id: 13,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    title: 'Sea-Facing 4BHK Apartment',
    price: 45000000,
    location: 'Worli, Mumbai',
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 14,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500',
    title: 'Premium 3BHK Residence',
    price: 120000,
    location: 'Bandra West, Mumbai',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    type: 'Apartment',
    status: 'For Rent'
  },
  {
    id: 15,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500',
    title: 'Luxury Penthouse',
    price: 85000000,
    location: 'Juhu, Mumbai',
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 16,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
    title: 'Modern 2BHK Flat',
    price: 85000,
    location: 'Powai, Mumbai',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'Apartment',
    status: 'For Rent'
  },
  {
    id: 17,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
    title: 'Spacious Villa',
    price: 95000000,
    location: 'Versova, Mumbai',
    bedrooms: 6,
    bathrooms: 6,
    area: 5000,
    type: 'Villa',
    status: 'For Sale'
  },
  
  // DELHI Properties
  {
    id: 18,
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
    title: 'Elegant 4BHK Villa',
    price: 55000000,
    location: 'Greater Kailash, Delhi',
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    type: 'Villa',
    status: 'For Sale'
  },
  {
    id: 19,
    image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
    title: 'Luxury 3BHK Apartment',
    price: 32000000,
    location: 'Vasant Kunj, Delhi',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 20,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
    title: 'Premium 2BHK Flat',
    price: 65000,
    location: 'Hauz Khas, Delhi',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    type: 'Apartment',
    status: 'For Rent'
  },
  {
    id: 21,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
    title: 'Modern Penthouse',
    price: 48000000,
    location: 'Connaught Place, Delhi',
    bedrooms: 4,
    bathrooms: 4,
    area: 3000,
    type: 'Apartment',
    status: 'For Sale'
  },
  {
    id: 22,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
    title: 'Cozy 1BHK Studio',
    price: 35000,
    location: 'Lajpat Nagar, Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    type: 'Apartment',
    status: 'For Rent'
  }
];

// Properties from buy.jsx
const saleProperties = [
    // PUNE Properties
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=500',
      title: 'Luxury 2BHK Apartment',
      price: 12000000,
      location: 'Viman Nagar, Pune',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Beautiful 3BHK Villa',
      price: 18000000,
      location: 'Wakad, Pune',
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 23,
      image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=500',
      title: 'Spacious 4BHK Apartment',
      price: 22000000,
      location: 'Magarpatta, Pune',
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 24,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Premium Villa with Garden',
      price: 28000000,
      location: 'Aundh, Pune',
      bedrooms: 5,
      bathrooms: 4,
      area: 3200,
      type: 'Villa',
      status: 'For Sale'
    },
    
    // BANGALORE Properties
    {
      id: 25,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500',
      title: 'Tech Park View 3BHK',
      price: 18500000,
      location: 'Whitefield, Bangalore',
      bedrooms: 3,
      bathrooms: 3,
      area: 1950,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 26,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Luxury 4BHK Villa',
      price: 35000000,
      location: 'Koramangala, Bangalore',
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 27,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
      title: 'Modern 2BHK Apartment',
      price: 12500000,
      location: 'HSR Layout, Bangalore',
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 28,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
      title: 'Spacious 5BHK Villa',
      price: 45000000,
      location: 'Indiranagar, Bangalore',
      bedrooms: 5,
      bathrooms: 5,
      area: 4200,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 29,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 28000000,
      location: 'Jayanagar, Bangalore',
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      type: 'Apartment',
      status: 'For Sale'
    },
    
    // HYDERABAD Properties
    {
      id: 30,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
      title: 'Grand 4BHK Villa',
      price: 25000000,
      location: 'Jubilee Hills, Hyderabad',
      bedrooms: 4,
      bathrooms: 4,
      area: 3500,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 31,
      image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
      title: 'Modern 3BHK Apartment',
      price: 15000000,
      location: 'Gachibowli, Hyderabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 32,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Luxury 2BHK Flat',
      price: 9500000,
      location: 'Banjara Hills, Hyderabad',
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 33,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      title: 'Spacious 5BHK Villa',
      price: 42000000,
      location: 'Madhapur, Hyderabad',
      bedrooms: 5,
      bathrooms: 5,
      area: 4000,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 34,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
      title: 'Premium 4BHK Penthouse',
      price: 32000000,
      location: 'HITEC City, Hyderabad',
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      type: 'Apartment',
      status: 'For Sale'
    },
    
    // CHENNAI Properties
    {
      id: 35,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Beachside 4BHK Villa',
      price: 28000000,
      location: 'ECR, Chennai',
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 36,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Luxury 3BHK Apartment',
      price: 16500000,
      location: 'Adyar, Chennai',
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 37,
      image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=500',
      title: 'Modern 2BHK Flat',
      price: 10500000,
      location: 'Anna Nagar, Chennai',
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 38,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Spacious 5BHK Villa',
      price: 38000000,
      location: 'Boat Club Road, Chennai',
      bedrooms: 5,
      bathrooms: 5,
      area: 3800,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 39,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 22000000,
      location: 'OMR, Chennai',
      bedrooms: 3,
      bathrooms: 3,
      area: 2400,
      type: 'Apartment',
      status: 'For Sale'
    },
    
    // KOLKATA Properties
    {
      id: 40,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Heritage 4BHK Apartment',
      price: 18000000,
      location: 'Alipore, Kolkata',
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 41,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
      title: 'Luxury 3BHK Villa',
      price: 25000000,
      location: 'Ballygunge, Kolkata',
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 42,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
      title: 'Modern 2BHK Flat',
      price: 9500000,
      location: 'Salt Lake, Kolkata',
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 43,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
      title: 'Spacious 5BHK Villa',
      price: 32000000,
      location: 'New Town, Kolkata',
      bedrooms: 5,
      bathrooms: 4,
      area: 3600,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 44,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
      title: 'Premium 4BHK Apartment',
      price: 21000000,
      location: 'Park Street, Kolkata',
      bedrooms: 4,
      bathrooms: 3,
      area: 2600,
      type: 'Apartment',
      status: 'For Sale'
    },
    
    // AHMEDABAD Properties
    {
      id: 45,
      image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
      title: 'Elegant 4BHK Villa',
      price: 22000000,
      location: 'Satellite, Ahmedabad',
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 46,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Modern 3BHK Apartment',
      price: 12500000,
      location: 'Bodakdev, Ahmedabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 1900,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 47,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      title: 'Luxury 2BHK Flat',
      price: 8500000,
      location: 'Prahlad Nagar, Ahmedabad',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: 'Apartment',
      status: 'For Sale'
    },
    {
      id: 48,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
      title: 'Spacious 5BHK Villa',
      price: 35000000,
      location: 'Sindhu Bhavan Road, Ahmedabad',
      bedrooms: 5,
      bathrooms: 5,
      area: 3800,
      type: 'Villa',
      status: 'For Sale'
    },
    {
      id: 49,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 18000000,
      location: 'SG Highway, Ahmedabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 2300,
      type: 'Apartment',
      status: 'For Sale'
    }
];

// Properties from rent.jsx
const rentalProperties = [
    // PUNE Properties
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Cozy 2BHK Flat',
      price: 35000,
      location: 'Wakad, Pune',
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Modern 1BHK Studio',
      price: 25000,
      location: 'Hinjewadi, Pune',
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Spacious 4BHK Villa',
      price: 75000,
      location: 'Baner, Pune',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Premium 2BHK Flat',
      price: 45000,
      location: 'Koregaon Park, Pune',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Compact Studio Apartment',
      price: 20000,
      location: 'Viman Nagar, Pune',
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
      title: 'Luxury 3BHK Penthouse',
      price: 65000,
      location: 'Viman Nagar, Pune',
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // MUMBAI Properties
    {
      id: 50,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
      title: 'Sea View 3BHK Apartment',
      price: 150000,
      location: 'Marine Drive, Mumbai',
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 51,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
      title: 'Luxury 4BHK Villa',
      price: 200000,
      location: 'Andheri West, Mumbai',
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 52,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
      title: 'Modern 2BHK Flat',
      price: 95000,
      location: 'Lower Parel, Mumbai',
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 53,
      image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
      title: 'Premium 1BHK Studio',
      price: 55000,
      location: 'Khar, Mumbai',
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 54,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Spacious 3BHK Penthouse',
      price: 175000,
      location: 'Dadar, Mumbai',
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // DELHI Properties
    {
      id: 55,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      title: 'Elegant 3BHK Apartment',
      price: 75000,
      location: 'Saket, Delhi',
      bedrooms: 3,
      bathrooms: 3,
      area: 1900,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 56,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
      title: 'Luxury 4BHK Villa',
      price: 125000,
      location: 'Defence Colony, Delhi',
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 57,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Modern 2BHK Flat',
      price: 50000,
      location: 'Dwarka, Delhi',
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 58,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Compact 1BHK Studio',
      price: 30000,
      location: 'Rohini, Delhi',
      bedrooms: 1,
      bathrooms: 1,
      area: 700,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 59,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 95000,
      location: 'Chanakyapuri, Delhi',
      bedrooms: 3,
      bathrooms: 3,
      area: 2300,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // BANGALORE Properties
    {
      id: 60,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Tech Hub 3BHK Apartment',
      price: 65000,
      location: 'Electronic City, Bangalore',
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 61,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
      title: 'Luxury 4BHK Villa',
      price: 110000,
      location: 'Sarjapur Road, Bangalore',
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 62,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
      title: 'Modern 2BHK Flat',
      price: 45000,
      location: 'Marathahalli, Bangalore',
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 63,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
      title: 'Premium 1BHK Studio',
      price: 28000,
      location: 'BTM Layout, Bangalore',
      bedrooms: 1,
      bathrooms: 1,
      area: 750,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 64,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
      title: 'Spacious 3BHK Penthouse',
      price: 85000,
      location: 'Richmond Town, Bangalore',
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // HYDERABAD Properties
    {
      id: 65,
      image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
      title: 'IT Park 3BHK Apartment',
      price: 55000,
      location: 'Kondapur, Hyderabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 1750,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 66,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Luxury 4BHK Villa',
      price: 95000,
      location: 'Kukatpally, Hyderabad',
      bedrooms: 4,
      bathrooms: 4,
      area: 2900,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 67,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      title: 'Modern 2BHK Flat',
      price: 40000,
      location: 'Ameerpet, Hyderabad',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 68,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
      title: 'Compact 1BHK Studio',
      price: 25000,
      location: 'Miyapur, Hyderabad',
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 69,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 72000,
      location: 'Financial District, Hyderabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // CHENNAI Properties
    {
      id: 70,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Beach View 3BHK Apartment',
      price: 60000,
      location: 'Besant Nagar, Chennai',
      bedrooms: 3,
      bathrooms: 3,
      area: 1850,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 71,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Luxury 4BHK Villa',
      price: 100000,
      location: 'Nungambakkam, Chennai',
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 72,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Modern 2BHK Flat',
      price: 42000,
      location: 'Velachery, Chennai',
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 73,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500',
      title: 'Premium 1BHK Studio',
      price: 27000,
      location: 'Thoraipakkam, Chennai',
      bedrooms: 1,
      bathrooms: 1,
      area: 700,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 74,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500',
      title: 'Spacious 3BHK Penthouse',
      price: 78000,
      location: 'T Nagar, Chennai',
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // KOLKATA Properties
    {
      id: 75,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500',
      title: 'Heritage 3BHK Apartment',
      price: 48000,
      location: 'Rajarhat, Kolkata',
      bedrooms: 3,
      bathrooms: 3,
      area: 1700,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 76,
      image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=500',
      title: 'Luxury 4BHK Villa',
      price: 85000,
      location: 'EM Bypass, Kolkata',
      bedrooms: 4,
      bathrooms: 4,
      area: 2700,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 77,
      image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=500',
      title: 'Modern 2BHK Flat',
      price: 35000,
      location: 'Howrah, Kolkata',
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 78,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
      title: 'Compact 1BHK Studio',
      price: 22000,
      location: 'Dumdum, Kolkata',
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 79,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      title: 'Premium 3BHK Penthouse',
      price: 68000,
      location: 'Lake Town, Kolkata',
      bedrooms: 3,
      bathrooms: 3,
      area: 1950,
      type: 'Apartment',
      status: 'For Rent'
    },
    
    // AHMEDABAD Properties
    {
      id: 80,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500',
      title: 'Modern 3BHK Apartment',
      price: 42000,
      location: 'Vastrapur, Ahmedabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 81,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500',
      title: 'Luxury 4BHK Villa',
      price: 78000,
      location: 'Thaltej, Ahmedabad',
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      type: 'Villa',
      status: 'For Rent'
    },
    {
      id: 82,
      image: 'https://images.unsplash.com/photo-1600577944116-6e958d9a2e3a?w=500',
      title: 'Premium 2BHK Flat',
      price: 32000,
      location: 'Maninagar, Ahmedabad',
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 83,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      title: 'Compact 1BHK Studio',
      price: 20000,
      location: 'Navrangpura, Ahmedabad',
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      type: 'Apartment',
      status: 'For Rent'
    },
    {
      id: 84,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      title: 'Spacious 3BHK Penthouse',
      price: 62000,
      location: 'Ambli, Ahmedabad',
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      type: 'Apartment',
      status: 'For Rent'
    }
];

// Combine all properties into a single master list
const allPropertiesMap = new Map();
[...homeProperties, ...saleProperties, ...rentalProperties].forEach(property => {
    allPropertiesMap.set(property.id, property);
});

export const ALL_PROPERTIES = Array.from(allPropertiesMap.values());
export const sampleProperties = homeProperties;

// ============================================================================
// FAVORITES UTILITY FUNCTIONS
// ============================================================================

export const FavoritesManager = {
  // Get all favorite property IDs from localStorage
  getFavorites: () => {
    try {
      const favorites = localStorage.getItem('propertyFavorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  // Save favorites to localStorage
  saveFavorites: (favorites) => {
    try {
      localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  // Toggle favorite status for a property
  toggleFavorite: (propertyId) => {
    const favorites = FavoritesManager.getFavorites();
    const index = favorites.indexOf(propertyId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(propertyId);
    }
    
    FavoritesManager.saveFavorites(favorites);
    return favorites;
  },

  // Check if a property is favorited
  isFavorite: (propertyId) => {
    const favorites = FavoritesManager.getFavorites();
    return favorites.includes(propertyId);
  },

  // Get all favorited properties
  getFavoriteProperties: () => {
    const favoriteIds = FavoritesManager.getFavorites();
    return ALL_PROPERTIES.filter(property => favoriteIds.includes(property.id));
  }
};

// ============================================================================
// PROPERTY CARD COMPONENT - WITH FAVORITES
// ============================================================================

const PropertyCard = ({ property, onFavoriteToggle }) => {
    // State to manage the favourite status
    const [isFavorited, setIsFavorited] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Check favorite status on mount and when property changes
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                // Check local storage first for quick display
                const localFavorite = FavoritesManager.isFavorite(property.id);
                setIsFavorited(localFavorite);
                
                // Then verify with API if user is authenticated
                const token = localStorage.getItem('authToken');
                if (token) {
                    const { favoritesAPI } = await import('../../services/api.service');
                    const response = await favoritesAPI.list();
                    if (response.success && response.data && response.data.favorites) {
                        const favoriteIds = response.data.favorites.map(f => f.property_id || f.id);
                        setIsFavorited(favoriteIds.includes(property.id));
                    }
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
                // Fallback to local storage
                setIsFavorited(FavoritesManager.isFavorite(property.id));
            }
        };
        
        checkFavoriteStatus();
    }, [property.id]);

    // Handle favorite button click
    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            // Import favoritesAPI dynamically to avoid circular dependencies
            const { favoritesAPI } = await import('../../services/api.service');
            const response = await favoritesAPI.toggle(property.id);
            
            if (response.success) {
                setIsFavorited(response.data.isFavorite || !isFavorited);
                // Also update local storage for offline support
                FavoritesManager.toggleFavorite(property.id);
                
                // Notify parent component if callback provided
                if (onFavoriteToggle) {
                    onFavoriteToggle();
                }
            } else {
                console.error('Failed to toggle favorite:', response.message);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Fallback to local storage if API fails
            FavoritesManager.toggleFavorite(property.id);
            setIsFavorited(!isFavorited);
        }
    };

    // Handle share button click
    const handleShareClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = `${window.location.origin}/details/${property.id}`;
        const shareData = {
            title: property.title,
            text: `Check out this property: ${property.title}`,
            url: shareUrl
        };

        // Check if Web Share API is supported (works great on mobile)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // User cancelled or error occurred
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    // Fallback to clipboard
                    copyToClipboard(shareUrl);
                }
            }
        } else {
            // Fallback: Copy to clipboard for desktop
            copyToClipboard(shareUrl);
        }
    };

    // Helper function to copy to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Link: ' + text);
        }
    };

    const { id, image, title, price, location, bedrooms, bathrooms, area, status } = property;
    const isForRent = status === 'For Rent';
    const priceDisplay = isForRent ? `₹${price?.toLocaleString('en-IN')}` : `₹${price?.toLocaleString('en-IN')}`;
    const priceLabel = isForRent ? 'Price/Month' : 'Price';

    // Default placeholder image
    const placeholderImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500';
    
    // Ensure we have a valid image URL
    const imageUrl = image && image.trim() !== '' ? image : placeholderImage;

    // Handle image load errors
    const handleImageError = (e) => {
        console.warn('Image failed to load:', imageUrl, 'for property:', title);
        e.target.src = placeholderImage;
        e.target.onerror = null; // Prevent infinite loop
    };

    return (
        <div className="buyer-property-card">
            <div className="buyer-property-image-container">
                <img 
                    src={imageUrl} 
                    alt={title || 'Property image'} 
                    className="buyer-property-image"
                    onError={handleImageError}
                    loading="lazy"
                />
                <span className={`buyer-property-status ${isForRent ? 'buyer-for-rent' : 'buyer-for-sale'}`}>{status}</span>
                
                {/* ★ FAVORITE BUTTON */}
                <button 
                    className={`buyer-favourite-btn ${isFavorited ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill={isFavorited ? 'white' : 'none'}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                {/* ★ SHARE BUTTON */}
                <button 
                    className="buyer-share-btn"
                    onClick={handleShareClick}
                    aria-label="Share property"
                    title="Share property"
                >
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
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>

                {/* Toast notification */}
                {showToast && (
                    <div className="buyer-share-toast">
                        Link copied!
                    </div>
                )}

            </div>

            <div className="buyer-property-content">
                <h3 className="buyer-property-title">{title}</h3>
                <p className="buyer-property-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {location}
                </p>

                <div className="buyer-property-details">
                    {(bedrooms && bedrooms !== '0' && bedrooms !== 0) && (
                    <div className="buyer-detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 17l6-6 4 4 8-8"></path>
                            <path d="M17 2h5v5"></path>
                        </svg>
                        <span>{bedrooms} {bedrooms === '1' || bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    )}

                    {(bathrooms && bathrooms !== '0' && bathrooms !== 0) && (
                    <div className="buyer-detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 0l-1 1a1.5 1.5 0 0 0 0 1L7 9"></path>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            <circle cx="11" cy="11" r="2"></circle>
                        </svg>
                        <span>{bathrooms} {bathrooms === '1' || bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    )}
                    
                    <div className="buyer-detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                        <span>{area} sq.ft</span>
                    </div>
                </div>

                <div className="buyer-property-footer">
                    <div className="buyer-property-price">
                        <span className="buyer-price-label">{priceLabel}</span>
                        <span className="buyer-price-value">{priceDisplay}</span>
                    </div>
                    
                    <Link to={`/details/${id}`}> 
                        <button className="buyer-view-details-btn">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;