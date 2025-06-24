/**
 * GadgetImage Component - Komponen wrapper untuk gambar gadget yang konsisten
 *
 * Props:
 * - src: URL gambar
 * - alt: Alt text untuk gambar
 * - gadgetName: Nama gadget untuk fallback placeholder
 * - size: Ukuran gambar ('card', 'featured', 'detail', 'grid')
 * - className: Additional CSS classes
 */

import React, { useState } from "react";
import "./GadgetImage.css";

const GadgetImage = ({
  src,
  alt,
  gadgetName,
  size = "card",
  className = "",
  onClick = null,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate consistent placeholder URL
  const getPlaceholderUrl = (name, width = 400, height = 300) => {
    const colors = [
      "4F46E5",
      "059669",
      "DC2626",
      "7C3AED",
      "1F2937",
      "991B1B",
      "374151",
      "0F172A",
    ];
    const colorIndex = name ? name.length % colors.length : 0;
    const color = colors[colorIndex];
    return `https://placehold.co/${width}x${height}/${color}/FFFFFF?text=${encodeURIComponent(
      name || "Gadget"
    )}`;
  };

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case "featured":
        return "gadget-image-featured aspect-4-3";
      case "detail":
        return "gadget-image-detail aspect-4-3";
      case "grid":
        return "gadget-image-grid aspect-4-3";
      case "card":
      default:
        return "gadget-image-card aspect-4-3";
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const imageUrl = src || getPlaceholderUrl(gadgetName);
  const fallbackUrl = getPlaceholderUrl(gadgetName);

  return (
    <div
      className={`gadget-image-container ${getSizeClasses()} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="gadget-image-loading w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Main image */}
      <img
        src={imageError ? fallbackUrl : imageUrl}
        alt={alt || gadgetName || "Gadget"}
        className={`gadget-image ${imageLoaded ? "opacity-100" : "opacity-0"} ${
          onClick ? "cursor-pointer" : ""
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
        style={{ transition: "opacity 0.3s ease-in-out" }}
      />

      {/* Error state */}
      {imageError && imageLoaded && (
        <div className="absolute inset-0 gadget-image-error">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default GadgetImage;
