// src/context/PropertyContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const PropertyContext = createContext();

// Sample initial properties for demo
const sampleProperties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment in Bandra West",
    location: "Bandra West, Mumbai",
    price: "25000000",
    bedrooms: "3",
    bathrooms: "2",
    area: "1850",
    status: "sale",
    propertyType: "Apartment",
    furnishing: "Semi-Furnished",
    facing: "East",
    floor: "12",
    totalFloors: "20",
    age: "New Construction",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup"],
    description: "Beautiful 3BHK apartment with sea view, modern amenities and premium finishes.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    createdAt: new Date().toISOString(),
    views: 1234,
    inquiries: 23,
    featured: true
  },
  {
    id: 2,
    title: "Modern Villa with Private Pool",
    location: "Koramangala, Bangalore",
    price: "45000000",
    bedrooms: "4",
    bathrooms: "4",
    area: "3500",
    status: "sale",
    propertyType: "Villa",
    furnishing: "Fully-Furnished",
    facing: "North",
    floor: "G",
    totalFloors: "2",
    age: "1-5 Years",
    amenities: ["Private Pool", "Garden", "Home Theater", "Modular Kitchen", "Smart Home"],
    description: "Stunning villa with contemporary design, private pool and landscaped garden.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    views: 856,
    inquiries: 15,
    featured: false
  },
  {
    id: 3,
    title: "Cozy Studio in Koramangala",
    location: "Koramangala 5th Block, Bangalore",
    price: "18000",
    bedrooms: "1",
    bathrooms: "1",
    area: "550",
    status: "rent",
    propertyType: "Studio Apartment",
    furnishing: "Fully-Furnished",
    facing: "South",
    floor: "5",
    totalFloors: "8",
    age: "5-10 Years",
    amenities: ["Gym", "Parking", "Security", "Lift"],
    description: "Perfect studio apartment for young professionals, close to tech parks.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    views: 567,
    inquiries: 8,
    featured: false
  }
];

// Sample inquiries for demo
const sampleInquiries = [
  {
    id: 1,
    propertyId: 1,
    propertyTitle: "Luxury 3BHK Apartment in Bandra West",
    buyerName: "Rahul Sharma",
    buyerEmail: "rahul.sharma@email.com",
    buyerPhone: "+91 98765 43210",
    message: "I am interested in this property. Can we schedule a site visit this weekend?",
    status: "new",
    createdAt: new Date().toISOString(),
    avatar: "R"
  },
  {
    id: 2,
    propertyId: 1,
    propertyTitle: "Luxury 3BHK Apartment in Bandra West",
    buyerName: "Priya Patel",
    buyerEmail: "priya.patel@email.com",
    buyerPhone: "+91 87654 32109",
    message: "Is the price negotiable? I am a genuine buyer looking to close within this month.",
    status: "read",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    avatar: "P"
  },
  {
    id: 3,
    propertyId: 2,
    propertyTitle: "Modern Villa with Private Pool",
    buyerName: "Amit Singh",
    buyerEmail: "amit.singh@email.com",
    buyerPhone: "+91 76543 21098",
    message: "Beautiful property! What are the maintenance charges and society rules?",
    status: "new",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    avatar: "A"
  },
  {
    id: 4,
    propertyId: 3,
    propertyTitle: "Cozy Studio in Koramangala",
    buyerName: "Sneha Reddy",
    buyerEmail: "sneha.r@email.com",
    buyerPhone: "+91 65432 10987",
    message: "Is this available for immediate move-in? I am relocating for work.",
    status: "replied",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    avatar: "S"
  },
  {
    id: 5,
    propertyId: 2,
    propertyTitle: "Modern Villa with Private Pool",
    buyerName: "Vikram Joshi",
    buyerEmail: "vikram.j@email.com",
    buyerPhone: "+91 54321 09876",
    message: "Can you share more photos of the backyard and pool area?",
    status: "new",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    avatar: "V"
  }
];

export const PropertyProvider = ({ children }) => {
  // Properties state
  const [properties, setProperties] = useState(() => {
    try {
      const raw = localStorage.getItem("properties_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.length > 0 ? parsed : sampleProperties;
      }
      return sampleProperties;
    } catch {
      return sampleProperties;
    }
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState(() => {
    try {
      const raw = localStorage.getItem("inquiries_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.length > 0 ? parsed : sampleInquiries;
      }
      return sampleInquiries;
    } catch {
      return sampleInquiries;
    }
  });

  // Persist properties
  useEffect(() => {
    try {
      localStorage.setItem("properties_v2", JSON.stringify(properties));
    } catch {}
  }, [properties]);

  // Persist inquiries
  useEffect(() => {
    try {
      localStorage.setItem("inquiries_v1", JSON.stringify(inquiries));
    } catch {}
  }, [inquiries]);

  // Add new property
  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      views: 0,
      inquiries: 0,
      featured: false
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  // Update property
  const updateProperty = (id, updates) => {
    setProperties(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  // Delete property
  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    // Also remove related inquiries
    setInquiries(prev => prev.filter(i => i.propertyId !== id));
  };

  // Update inquiry status
  const updateInquiryStatus = (id, status) => {
    setInquiries(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  };

  // Delete inquiry
  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  // Get stats
  const getStats = () => {
    const totalProperties = properties.length;
    const forSale = properties.filter(p => p.status === 'sale').length;
    const forRent = properties.filter(p => p.status === 'rent').length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter(i => i.status === 'new').length;

    return {
      totalProperties,
      forSale,
      forRent,
      totalViews,
      totalInquiries,
      newInquiries
    };
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      setProperties,
      inquiries,
      setInquiries,
      addProperty,
      updateProperty,
      deleteProperty,
      updateInquiryStatus,
      deleteInquiry,
      getStats
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};