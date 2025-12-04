// fileName: ViewDetailsPage.jsx

import React, { useState, useCallback, useEffect } from 'react'; 
import { useParams, Navigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaAngleLeft, FaAngleRight, FaBed, FaShower, FaRulerCombined, FaTimes, FaCheckCircle, FaUser, FaCommentAlt } from "react-icons/fa";
import '../styles/ViewDetailPage.css';
import { ALL_PROPERTIES } from '../components/PropertyCard';



// --- Image Slider Modal Component ---
const ImageSliderModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {

    // Determine if the modal should be open based on currentIndex (or external state)
    const isOpen = currentIndex !== null;
    
    // Safety check for image data
    if (!images || images.length === 0) return null;
    
    // Get the current image
    const currentImage = isOpen ? images[currentIndex] : null;
    
    // Check if controls should be visible
    const showControls = images.length > 1;
    return (
        <div className={`buyer-image-slider-modal-overlay ${isOpen ? 'open' : ''}`}>
            {currentImage && (
                <div className="buyer-image-slider-modal-content">
                    
                    {/* Close Button */}
                    <button className="buyer-slider-close-btn" onClick={onClose} aria-label="Close Slider">
                        <FaTimes />
                    </button>
                    
                    <div className="buyer-slider-controls">
                        {/* Previous Button */}
                        {showControls && (
                            <button className="buyer-slider-prev-btn" onClick={onPrev} aria-label="Previous Image">
                                <FaAngleLeft />
                            </button>
                        )}
                        
                        {/* Main Image */}
                        <img 
                            src={currentImage.url} 
                            alt={currentImage.alt} 
                            className="buyer-slider-main-image" 
                        />

                        {/* Next Button */}
                        {showControls && (
                            <button className="buyer-slider-next-btn" onClick={onNext} aria-label="Next Image">
                                <FaAngleRight />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Helper function to map property data to ViewDetailsPage structure ---
const getPropertyDetails = (property) => {
    window.scrollTo(0,0);
    if (!property) return null;
    
    const staticDetails = {
        description: `Discover unparalleled living in this magnificent ${property.type}. Featuring modern amenities, panoramic city views, and spacious interiors. Perfect blend of comfort and luxury.`,
        amenities: ["Swimming Pool", "Gymnasium", "24/7 Security", "Covered Parking", "Clubhouse", "Children's Play Area"],
        images: [
            { id: 1, url: property.image, alt: property.title },
            { id: 2, url: "https://media.designcafe.com/wp-content/uploads/2021/11/26115936/1-bhk-kitchen-design-with-handleless-cabinets-open-shelves-in-built-hob-and-chimney.jpg", alt: "Modern kitchen" },
            { id: 3, url: "https://media.designcafe.com/wp-content/uploads/2022/03/05170324/1-bhk-bedroom-designed-with-sliding-wardrobe-and-king-sized-bed.jpg", alt: "Master bedroom" },
            { id: 4, url: "https://assets.architecturaldigest.in/photos/600838b064356272514af83a/16:9/w_2560%2Cc_limit/bkc-home-featured-image-1366x768.jpg", alt: "Spacious hall" },
            { id: 5, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr4zqkrF9ohjHeKHE_JcACET7U8urQ15bShQ&s", alt: "Additional View 1" },
        ].slice(0, 5),
    };
    
    return {
        title: property.title,
        location: property.location,
        price: property.status === 'For Rent' ? `₹ ${property.price.toLocaleString('en-IN')}/Month` : `₹ ${property.price.toLocaleString('en-IN')}`,
        area: `${property.area?.toLocaleString('en-IN')} sq.ft.`,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        status: property.status,
        ...staticDetails
    };
}

// ============================================================================
// GOOGLE MAP FEATURE COMPONENT (Placeholder)
// ============================================================================

const GoogleMapFeature = ({ location }) => {
    // NOTE: This serves as a styled placeholder. The real implementation would involve
    // converting 'location' to coordinates and using a React Google Maps library
    // (like @react-google-maps/api) or the vanilla Google Maps JS API.
    
    return (
        <div className="buyer-map-card-container">
            <h3>Property Location</h3>
            <div className="buyer-map-embed-area" aria-label={`Google Map for ${location}`}>
                <p className="buyer-map-placeholder-text">
                    Map Feature Placeholder: Location for <strong>{location}</strong>
                </p>
            </div>
        </div>
    );
}

// --- Main Page Component ---
const ViewDetailsPage = () => {
    // Get the property ID from the URL parameter
    const { id } = useParams();
    const propertyId = parseInt(id, 10);

    // Find the matching property data (can be null)
    const foundProperty = ALL_PROPERTIES.find(p => p.id === propertyId);
    const propertyData = getPropertyDetails(foundProperty);

    // Safely calculate image count for hook dependencies
    const imageCount = propertyData?.images?.length || 0; 

    // --- 1. DEFINE ALL STATE HOOKS UNCONDITIONALLY ---
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    
    // Inquiry Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // --- 2. DEFINE ALL CALLBACK HOOKS UNCONDITIONALLY ---
    
    const openSlider = useCallback((index) => {
        if (imageCount > 0) { // Safety check
            setCurrentImageIndex(index);
        }
    }, [imageCount]);

    const closeSlider = useCallback(() => {
        setCurrentImageIndex(null);
    }, []);

    const nextImage = useCallback(() => {
        if (imageCount === 0) return; // Safety check
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % imageCount
        );
    }, [imageCount]); // Dependency is now the safe 'imageCount'

    const prevImage = useCallback(() => {
        if (imageCount === 0) return; // Safety check
        setCurrentImageIndex((prevIndex) => 
            (prevIndex - 1 + imageCount) % imageCount
        );
    }, [imageCount]); // Dependency is now the safe 'imageCount'

    // Handler for the Back Button
    const handleBack = useCallback(() => {
        // Navigates back one step in the browser history
        window.history.back(); 
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmitInquiry = (e) => {
        e.preventDefault();
        
        // Here you would typically send the data to your backend
        console.log('Inquiry submitted:', {
            ...formData,
            propertyId: propertyId,
            propertyTitle: propertyData.title
        });
        
        // Show success message
        setIsSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                message: ''
            });
        }, 3000);
    };

    // --- 3. DEFINE ALL useEffect HOOKS UNCONDITIONALLY ---
    
    // Keyboard navigation for slider
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (currentImageIndex === null) return;
            
            if (e.key === 'Escape') {
                closeSlider();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentImageIndex, closeSlider, nextImage, prevImage]);

    // --- 4. CONDITIONAL RENDERING / REDIRECT BASED ON DATA ---

    if (!foundProperty || !propertyData) {
        return <Navigate to="/" replace />;
    }

    // --- 5. CALCULATIONS & NORMAL JS LOGIC ---
    
    // Calculate number of thumbnails and extra images
    const thumbnailImages = propertyData.images.slice(1, 4); // Get the next 3 images
    const remainingCount = propertyData.images.length - 4; // Count any extras

    // --- 6. RENDER THE JSX ---
    
    return (
        <div className="buyer-details-wrapper">
            <main className="buyer-view-details-page">
                <div className="buyer-details-container">

                    {/* Back Button */}
                    <button className="buyer-back-button" onClick={handleBack}>
                        <FaAngleLeft />
                    </button>

                    {/* Property Header - ENHANCED */}
                    <header className="buyer-property-header">
                        <div className="buyer-header-badges">
                            <button 
                                className={`buyer-status-badge ${propertyData.status === 'For Sale' ? 'buyer-for-sale' : 'buyer-for-rent'}`}
                            >
                                {propertyData.status}
                            </button>
                            <span className="buyer-premium-badge">
                                🏠 Premium Property
                            </span>
                        </div>
                        <h1>{propertyData.title}</h1>
                        <p className="buyer-property-location">
                            {propertyData.location}
                        </p>
                        <div className="buyer-property-meta-info">
                            <div className="buyer-meta-divider"></div>
                            <div className="buyer-meta-item">
                                <span className="buyer-meta-label">Listed Since</span>
                                <span className="buyer-meta-value">Dec 2024</span>
                            </div>
                            <div className="buyer-meta-divider"></div>
                        </div>
                    </header>

                    <div className="buyer-main-content-area">

                        {/* --- Left Column (Details) --- */}
                        <section className="buyer-property-details-section">

                            {/* Image Gallery */}
                            <div className="buyer-image-gallery">
                                {/* Main Image (Grid Column 1) */}
                                <div className="buyer-main-image" onClick={() => openSlider(0)}>
                                    <img src={propertyData.images[0].url} alt={propertyData.images[0].alt} />
                                </div>

                                {/* Thumbnails (Grid Column 2) */}
                                <div className="buyer-thumbnail-gallery">
                                    {thumbnailImages.map((image, index) => (
                                        <div 
                                            key={image.id} 
                                            // The index here starts at 0, but corresponds to the original array index (1, 2, 3)
                                            className="buyer-thumbnail" 
                                            onClick={() => openSlider(index + 1)} 
                                        >
                                            <img src={image.url} alt={image.alt} />
                                            {index === 2 && remainingCount > 0 && (
                                                <div className="buyer-view-more-overlay">
                                                    <span>+{remainingCount} Photos</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Features using .features-grid */}
                            <div className="buyer-features-grid">
                                {/* Price/Rent */}
                                <div className="buyer-feature-item">
                                    <div className="buyer-feature-icon">
                                        {/* Using an icon placeholder for the price block */}
                                        <span role="img" aria-label="price">💰</span>
                                    </div>
                                    <span className="buyer-feature-value">{propertyData.price}</span>
                                    <span className="buyer-feature-label">{propertyData.status === 'For Rent' ? 'Monthly Rent' : 'Total Price'}</span>
                                </div>

                                {/* Bedrooms */}
                                <div className="buyer-feature-item">
                                    <div className="buyer-feature-icon">
                                        <FaBed />
                                    </div>
                                    <span className="buyer-feature-value">{propertyData.bedrooms}</span>
                                    <span className="buyer-feature-label">Bedrooms</span>
                                </div>

                                {/* Bathrooms */}
                                <div className="buyer-feature-item">
                                    <div className="buyer-feature-icon">
                                        <FaShower />
                                    </div>
                                    <span className="buyer-feature-value">{propertyData.bathrooms}</span>
                                    <span className="buyer-feature-label">Bathrooms</span>
                                </div>

                                {/* Area */}
                                <div className="buyer-feature-item">
                                    <div className="buyer-feature-icon">
                                        <FaRulerCombined />
                                    </div>
                                    <span className="buyer-feature-value">{propertyData.area}</span>
                                    <span className="buyer-feature-label">Area</span>
                                </div>
                            </div>
                            {/* END of Key Features */}

                            <hr className="buyer-divider" />

                            {/* Description */}
                            <div className="buyer-description-section">
                                <h2>Description</h2>
                                <p>{propertyData.description}</p>
                            </div>
                            <hr className="buyer-divider" />

                            {/* Amenities */}
                            <div className="buyer-amenities-section">
                                <h2>Amenities</h2>
                                <div className="buyer-amenities-grid">
                                    {propertyData.amenities.map((amenity, index) => (
                                        <div key={index} className="buyer-amenity-item">
                                            <FaCheckCircle className="buyer-check-icon" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* --- Right Column (Inquiry Form) --- */}
                        <aside className="buyer-agent-sidebar">
                            
                            {/* Google Map Feature Card */}
                            <GoogleMapFeature location={propertyData.location} /> 

                            {/* Contact Form Card */}
                            <div className="buyer-detail-contact-card">
                                <h3>Get in Touch</h3>
                                <p className="buyer-contact-card-subtitle">Send your inquiry about this property</p>
                                
                                {!isSubmitted ? (
                                    <form className="buyer-detail-contact-form" onSubmit={handleSubmitInquiry}>
                                        {/* Name Field */}
                                        <div className="buyer-contact-field-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <div className="buyer-contact-input-box">
                                                <FaUser className="buyer-contact-field-icon" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Your full name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="buyer-contact-field-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <div className="buyer-contact-input-box">
                                                <FaEnvelope className="buyer-contact-field-icon" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Mobile Field */}
                                        <div className="buyer-contact-field-group">
                                            <label htmlFor="mobile">Mobile Number *</label>
                                            <div className="buyer-contact-input-box">
                                                <FaPhone className="buyer-contact-field-icon" />
                                                <input
                                                    type="tel"
                                                    id="mobile"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Message Field */}
                                        <div className="buyer-contact-field-group">
                                            <label htmlFor="message">Your Message</label>
                                            <div className="buyer-contact-input-box buyer-contact-textarea-box">
                                                <FaCommentAlt className="buyer-contact-field-icon buyer-contact-textarea-icon" />
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    placeholder="I'm interested in this property..."
                                                    rows="4"
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button type="submit" className="buyer-contact-send-button">
                                            Send Inquiry
                                        </button>
                                    </form>
                                ) : (
                                    <div className="buyer-contact-success-message">
                                        <FaCheckCircle className="buyer-contact-success-icon" />
                                        <h4>Inquiry Sent Successfully!</h4>
                                        <p>Thank you for your interest. The owner will contact you soon.</p>
                                    </div>
                                )}
                            </div>
                        </aside>

                    </div>
                </div>
            </main>

            {/* Mount the Slider Modal outside the main structure */}
            {currentImageIndex !== null && (
                <ImageSliderModal
                    images={propertyData.images}
                    currentIndex={currentImageIndex}
                    onClose={closeSlider}
                    onNext={nextImage}
                    onPrev={prevImage}
                />
            )}
        </div>
    );
};

export default ViewDetailsPage;