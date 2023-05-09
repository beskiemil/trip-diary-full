import { useQuery } from '@tanstack/react-query';
import React from 'react';

import ErrorPage from './ErrorPage';
import PhotoGallery from '../components/organisms/PhotoGallery';

const Galeria = () => {
  const fetchPhotos = async () => {
    const response = await fetch('http://localhost:3000/photos', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Could not fetch photos');
    }
    return response.json();
  };

  const { data, status, error } = useQuery(['photos'], fetchPhotos);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <ErrorPage error={error} />;

  return (
    <div>
      <PhotoGallery images={data} />
    </div>
  );
};

export default Galeria;
