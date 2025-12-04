// src/components/AddPropertyPopup.jsx
import React, { useState, useRef, useEffect } from "react";
import { useProperty } from "./PropertyContext";
import "../styles/AddPropertyPopup.css";

const STEPS = [
  { id: 1, title: "Basic Info", icon: "📝" },
  { id: 2, title: "Property Details", icon: "🏠" },
  { id: 3, title: "Amenities", icon: "✨" },
  { id: 4, title: "Photos", icon: "📷" },
  { id: 5, title: "Pricing", icon: "💰" }
];

const PROPERTY_TYPES = [
  { value: "Apartment", icon: "🏢" },
  { value: "Flat", icon: "🏠" },
  { value: "Villa", icon: "🏡" },
  { value: "Independent House", icon: "🏘️" },
  { value: "Row House", icon: "🏘️" },
  { value: "Penthouse", icon: "🌆" },
  { value: "Studio Apartment", icon: "🛏️" },
  { value: "Farm House", icon: "🌳" },
  { value: "Plot / Land", icon: "📐" },
  { value: "Commercial Office", icon: "🏢" },
  { value: "Commercial Shop", icon: "🏪" },
  { value: "PG / Hostel", icon: "🛏️" }
];

const AMENITIES = [
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "lift", label: "Lift", icon: "🛗" },
  { id: "security", label: "24x7 Security", icon: "👮" },
  { id: "power_backup", label: "Power Backup", icon: "⚡" },
  { id: "gym", label: "Gym", icon: "🏋️" },
  { id: "swimming_pool", label: "Swimming Pool", icon: "🏊" },
  { id: "garden", label: "Garden", icon: "🌳" },
  { id: "clubhouse", label: "Club House", icon: "🏛️" },
  { id: "playground", label: "Children's Play Area", icon: "🎢" },
  { id: "cctv", label: "CCTV", icon: "📹" },
  { id: "intercom", label: "Intercom", icon: "📞" },
  { id: "fire_safety", label: "Fire Safety", icon: "🔥" },
  { id: "water_supply", label: "24x7 Water", icon: "💧" },
  { id: "gas_pipeline", label: "Gas Pipeline", icon: "🔥" },
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" }
];

const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"];
const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const AGE_OPTIONS = ["New Construction", "Less than 1 Year", "1-5 Years", "5-10 Years", "10+ Years"];

export default function AddPropertyPopup({ onClose, editIndex = null, initialData = null }) {
  const { addProperty, updateProperty, properties } = useProperty();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const fileRef = useRef();

  // Check property limit (3 properties max for free users)
  const PROPERTY_LIMIT = 3;
  const currentPropertyCount = properties?.length || 0;
  const hasReachedLimit = editIndex === null && currentPropertyCount >= PROPERTY_LIMIT;

  // Show limit warning if user has reached the limit
  useEffect(() => {
    if (hasReachedLimit) {
      setShowLimitWarning(true);
    }
  }, [hasReachedLimit]);

  const [formData, setFormData] = useState(initialData || {
    // Step 1: Basic Info
    title: "",
    status: "sale",
    propertyType: "",
    
    // Step 2: Property Details
    location: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    area: "",
    carpetArea: "",
    floor: "",
    totalFloors: "",
    facing: "",
    age: "",
    furnishing: "",
    
    // Step 3: Amenities
    amenities: [],
    description: "",
    
    // Step 4: Photos
    images: [],
    
    // Step 5: Pricing
    price: "",
    priceNegotiable: false,
    maintenanceCharges: "",
    depositAmount: ""
  });

  // Close on escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(f => URL.createObjectURL(f));
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages].slice(0, 10)
    }));
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: null }));
    }
  };

  const removeImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title?.trim()) newErrors.title = "Property title is required";
        if (!formData.propertyType) newErrors.propertyType = "Select property type";
        break;
      case 2:
        if (!formData.location?.trim()) newErrors.location = "Location is required";
        if (!formData.bedrooms) newErrors.bedrooms = "Required";
        if (!formData.bathrooms) newErrors.bathrooms = "Required";
        if (!formData.area) newErrors.area = "Built-up area is required";
        break;
      case 3:
        if (!formData.description?.trim()) newErrors.description = "Please add a description";
        break;
      case 4:
        if (!formData.images || formData.images.length === 0) {
          newErrors.images = "Add at least 1 photo";
        }
        break;
      case 5:
        if (!formData.price) newErrors.price = "Price is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editIndex !== null) {
      const propertyId = properties[editIndex]?.id;
      if (propertyId) {
        updateProperty(propertyId, formData);
      }
    } else {
      addProperty(formData);
    }

    setIsSubmitting(false);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="seller-popup-step-indicator">
      {STEPS.map((step, idx) => (
        <div 
          key={step.id}
          className={`seller-popup-step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
        >
          <div className="seller-popup-step-circle">
            {currentStep > step.id ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span>{step.icon}</span>
            )}
          </div>
          <span className="seller-popup-step-title">{step.title}</span>
          {idx < STEPS.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="seller-popup-step-content">
      <h3 className="step-heading">Basic Information</h3>
      <p className="step-subheading">Let's start with the basic details of your property</p>

      <div className="seller-popup-form-group">
        <label>Property Title <span className="required">*</span></label>
        <input
          type="text"
          placeholder="e.g., Spacious 3BHK Apartment with Sea View"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="seller-popup-error-text">{errors.title}</span>}
      </div>

      <div className="seller-popup-form-group">
        <label>I want to</label>
        <div className="toggle-buttons">
          <button
            type="button"
            className={`toggle-btn ${formData.status === 'sale' ? 'active' : ''}`}
            onClick={() => handleChange('status', 'sale')}
          >
            <span className="toggle-icon">🏷️</span>
            Sell
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.status === 'rent' ? 'active' : ''}`}
            onClick={() => handleChange('status', 'rent')}
          >
            <span className="toggle-icon">🔑</span>
            Rent / Lease
          </button>
        </div>
      </div>

      <div className="seller-popup-form-group">
        <label>Property Type <span className="required">*</span></label>
        <div className="seller-popup-property-type-grid">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              className={`property-type-btn ${formData.propertyType === type.value ? 'active' : ''}`}
              onClick={() => handleChange('propertyType', type.value)}
            >
              <span className="seller-popup-type-icon">{type.icon}</span>
              <span className="seller-popup-type-label">{type.value}</span>
            </button>
          ))}
        </div>
        {errors.propertyType && <span className="seller-popup-error-text">{errors.propertyType}</span>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="seller-popup-step-content">
      <h3 className="step-heading">Property Details</h3>
      <p className="step-subheading">Tell us more about your property specifications</p>

      <div className="seller-popup-form-group">
        <label>Location <span className="required">*</span></label>
        <div className="input-with-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Enter locality, area or landmark"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={errors.location ? 'error' : ''}
          />
        </div>
        {errors.location && <span className="seller-popup-error-text">{errors.location}</span>}
      </div>

      <div className="form-row three-cols">
        <div className="seller-popup-form-group">
          <label>Bedrooms <span className="required">*</span></label>
          <div className="number-selector">
            {['1', '2', '3', '4', '5', '5+'].map(num => (
              <button
                key={num}
                type="button"
                className={`num-btn ${formData.bedrooms === num ? 'active' : ''}`}
                onClick={() => handleChange('bedrooms', num)}
              >
                {num}
              </button>
            ))}
          </div>
          {errors.bedrooms && <span className="seller-popup-error-text">{errors.bedrooms}</span>}
        </div>

        <div className="seller-popup-form-group">
          <label>Bathrooms <span className="required">*</span></label>
          <div className="number-selector">
            {['1', '2', '3', '4', '4+'].map(num => (
              <button
                key={num}
                type="button"
                className={`num-btn ${formData.bathrooms === num ? 'active' : ''}`}
                onClick={() => handleChange('bathrooms', num)}
              >
                {num}
              </button>
            ))}
          </div>
          {errors.bathrooms && <span className="seller-popup-error-text">{errors.bathrooms}</span>}
        </div>

        <div className="seller-popup-form-group">
          <label>Balconies</label>
          <div className="number-selector">
            {['0', '1', '2', '3', '3+'].map(num => (
              <button
                key={num}
                type="button"
                className={`num-btn ${formData.balconies === num ? 'active' : ''}`}
                onClick={() => handleChange('balconies', num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row two-cols">
        <div className="seller-popup-form-group">
          <label>Built-up Area <span className="required">*</span></label>
          <div className="input-with-suffix">
            <input
              type="number"
              placeholder="Enter area"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              className={errors.area ? 'error' : ''}
            />
            <span className="suffix">sq.ft</span>
          </div>
          {errors.area && <span className="seller-popup-error-text">{errors.area}</span>}
        </div>

        <div className="seller-popup-form-group">
          <label>Carpet Area</label>
          <div className="input-with-suffix">
            <input
              type="number"
              placeholder="Enter area"
              value={formData.carpetArea}
              onChange={(e) => handleChange('carpetArea', e.target.value)}
            />
            <span className="suffix">sq.ft</span>
          </div>
        </div>
      </div>

      <div className="form-row two-cols">
        <div className="seller-popup-form-group">
          <label>Floor Number</label>
          <input
            type="text"
            placeholder="e.g., 5 or Ground"
            value={formData.floor}
            onChange={(e) => handleChange('floor', e.target.value)}
          />
        </div>

        <div className="seller-popup-form-group">
          <label>Total Floors</label>
          <input
            type="number"
            placeholder="Total floors in building"
            value={formData.totalFloors}
            onChange={(e) => handleChange('totalFloors', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row three-cols">
        <div className="seller-popup-form-group">
          <label>Facing</label>
          <select
            value={formData.facing}
            onChange={(e) => handleChange('facing', e.target.value)}
          >
            <option value="">Select</option>
            {FACING_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="seller-popup-form-group">
          <label>Property Age</label>
          <select
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
          >
            <option value="">Select</option>
            {AGE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="seller-popup-form-group">
          <label>Furnishing</label>
          <select
            value={formData.furnishing}
            onChange={(e) => handleChange('furnishing', e.target.value)}
          >
            <option value="">Select</option>
            {FURNISHING_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="seller-popup-step-content">
      <h3 className="step-heading">Amenities & Description</h3>
      <p className="step-subheading">Select the amenities available and describe your property</p>

      <div className="seller-popup-form-group">
        <label>Select Amenities</label>
        <div className="seller-popup-amenities-grid">
          {AMENITIES.map(amenity => (
            <button
              key={amenity.id}
              type="button"
              className={`amenity-btn ${formData.amenities.includes(amenity.id) ? 'active' : ''}`}
              onClick={() => toggleAmenity(amenity.id)}
            >
              <span className="seller-popup-amenity-icon">{amenity.icon}</span>
              <span className="seller-popup-amenity-label">{amenity.label}</span>
              {formData.amenities.includes(amenity.id) && (
                <span className="check-icon">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="seller-popup-form-group">
        <label>Property Description <span className="required">*</span></label>
        <textarea
          placeholder="Describe your property in detail. Mention unique features, nearby landmarks, connectivity, etc."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
          className={errors.description ? 'error' : ''}
        />
        <span className="char-count">{(formData.description || '').length}/1000</span>
        {errors.description && <span className="seller-popup-error-text">{errors.description}</span>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="seller-popup-step-content">
      <h3 className="step-heading">Upload Photos</h3>
      <p className="step-subheading">Add up to 10 high-quality photos of your property</p>

      <div 
        className={`upload-zone ${errors.images ? 'error' : ''}`}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <div className="seller-popup-upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>Drag & drop your photos here</h4>
          <p>or click to browse from your device</p>
          <span className="seller-popup-upload-hint">Supports: JPG, PNG, WEBP (Max 5MB each)</span>
        </div>
      </div>
      {errors.images && <span className="seller-popup-error-text center">{errors.images}</span>}

      {formData.images?.length > 0 && (
        <div className="image-preview-section">
          <div className="preview-header">
            <span>Uploaded Photos ({formData.images.length}/10)</span>
            <button 
              type="button" 
              className="add-more-btn"
              onClick={() => fileRef.current?.click()}
            >
              + Add More
            </button>
          </div>
          <div className="image-preview-grid">
            {formData.images.map((src, idx) => (
              <div key={idx} className="preview-item">
                <img src={src} alt={`Preview ${idx + 1}`} />
                {idx === 0 && <span className="cover-badge">Cover</span>}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImage(idx)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="seller-popup-step-content">
      <h3 className="step-heading">Pricing Details</h3>
      <p className="step-subheading">Set the right price for your property</p>

      <div className="seller-popup-form-group">
        <label>
          {formData.status === 'sale' ? 'Expected Price' : 'Monthly Rent'} 
          <span className="required">*</span>
        </label>
        <div className="price-input-wrapper">
          <span className="currency">₹</span>
          <input
            type="number"
            placeholder={formData.status === 'sale' ? 'Enter expected price' : 'Enter monthly rent'}
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={errors.price ? 'error' : ''}
          />
        </div>
        {formData.price && (
          <span className="price-words">
            {formatPriceInWords(formData.price)}
          </span>
        )}
        {errors.price && <span className="seller-popup-error-text">{errors.price}</span>}
      </div>

      <div className="seller-popup-form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.priceNegotiable}
            onChange={(e) => handleChange('priceNegotiable', e.target.checked)}
          />
          <span className="checkmark"></span>
          Price is negotiable
        </label>
      </div>

      {formData.status === 'rent' && (
        <div className="form-row two-cols">
          <div className="seller-popup-form-group">
            <label>Security Deposit</label>
            <div className="price-input-wrapper">
              <span className="currency">₹</span>
              <input
                type="number"
                placeholder="Enter deposit amount"
                value={formData.depositAmount}
                onChange={(e) => handleChange('depositAmount', e.target.value)}
              />
            </div>
          </div>

          <div className="seller-popup-form-group">
            <label>Maintenance (per month)</label>
            <div className="price-input-wrapper">
              <span className="currency">₹</span>
              <input
                type="number"
                placeholder="Enter maintenance"
                value={formData.maintenanceCharges}
                onChange={(e) => handleChange('maintenanceCharges', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {formData.status === 'sale' && (
        <div className="seller-popup-form-group">
          <label>Maintenance (per month)</label>
          <div className="price-input-wrapper">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="Enter monthly maintenance"
              value={formData.maintenanceCharges}
              onChange={(e) => handleChange('maintenanceCharges', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="seller-popup-listing-summary">
        <h4>Listing Summary</h4>
        <div className="seller-popup-summary-grid">
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Property</span>
            <span className="seller-popup-summary-value">{formData.title || '-'}</span>
          </div>
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Type</span>
            <span className="seller-popup-summary-value">{formData.propertyType || '-'}</span>
          </div>
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Location</span>
            <span className="seller-popup-summary-value">{formData.location || '-'}</span>
          </div>
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Configuration</span>
            <span className="seller-popup-summary-value">
              {formData.bedrooms ? `${formData.bedrooms} BHK` : '-'}
            </span>
          </div>
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Area</span>
            <span className="seller-popup-summary-value">
              {formData.area ? `${formData.area} sq.ft` : '-'}
            </span>
          </div>
          <div className="seller-popup-summary-item">
            <span className="seller-popup-summary-label">Photos</span>
            <span className="seller-popup-summary-value">
              {formData.images?.length || 0} uploaded
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const formatPriceInWords = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Crore`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(2)} Thousand`;
    }
    return `₹${num}`;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="seller-popup-overlay" onClick={(e) => e.target.classList.contains('seller-popup-overlay') && onClose()}>
      
      {/* Property Limit Warning Modal */}
      {showLimitWarning && (
        <div className="seller-popup-limit-warning-overlay">
          <div className="seller-popup-limit-warning-modal">
            <div className="seller-popup-limit-warning-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            
            <div className="seller-popup-limit-warning-content">
              <h3>Property Limit Reached</h3>
              <p>You've uploaded <strong>{currentPropertyCount}</strong> out of <strong>{PROPERTY_LIMIT}</strong> properties allowed in your free plan.</p>
              
              <div className="seller-popup-limit-progress">
                <div className="seller-popup-limit-progress-bar">
                  <div 
                    className="seller-popup-limit-progress-fill" 
                    style={{ width: `${(currentPropertyCount / PROPERTY_LIMIT) * 100}%` }}
                  ></div>
                </div>
                <span className="seller-popup-limit-progress-text">{currentPropertyCount}/{PROPERTY_LIMIT} Properties Used</span>
              </div>

              <div className="seller-popup-limit-warning-features">
                <p className="seller-popup-features-title">Upgrade to Pro to unlock:</p>
                <ul>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    More property listings
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Priority placement in search
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Advanced analytics & insights
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Dedicated support
                  </li>
                </ul>
              </div>
            </div>

            <div className="seller-popup-limit-warning-actions">
              <button className="seller-popup-limit-btn-secondary" onClick={onClose}>
                Maybe Later
              </button>
              <button className="seller-popup-limit-btn-primary" onClick={() => {
                onClose();
                // Navigate to subscription page - you can pass a callback or use navigate
                window.location.href = '/subscription';
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                </svg>
                Upgrade to Pro
              </button>
            </div>

            <button className="seller-popup-limit-warning-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Popup - Only show if limit not reached */}
      {!showLimitWarning && (
      <div className="seller-popup-container" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="seller-popup-header">
          <h2>{editIndex !== null ? 'Edit Property' : 'List Your Property'}</h2>
          <button className="seller-popup-close-btn" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="seller-popup-body">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="seller-popup-footer">
          {currentStep > 1 && (
            <button type="button" className="seller-popup-back-btn" onClick={handleBack}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Back
            </button>
          )}
          
          <div className="seller-popup-footer-right">
            <button type="button" className="seller-popup-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            
            {currentStep < 5 ? (
              <button type="button" className="seller-popup-next-btn" onClick={handleNext}>
                Next
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            ) : (
              <button 
                type="button" 
                className="seller-popup-submit-btn" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="seller-popup-spinner"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {editIndex !== null ? 'Update Property' : 'Publish Listing'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}