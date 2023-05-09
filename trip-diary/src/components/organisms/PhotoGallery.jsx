import React from 'react';

const PhotoGallery = ({ images, className }) => (
  <div className={`flex w-full flex-wrap ${className}`}>
    {images &&
      images.map(image => (
        <img
          src={`http://localhost:3000/${image}`}
          alt=""
          className="h-auto w-1/3 p-2 "
        />
      ))}
  </div>
);

export default PhotoGallery;
