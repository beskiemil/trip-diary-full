/* eslint-disable react/jsx-no-constructed-context-values */
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const PostContext = React.createContext({});

const PostProvider = ({ children }) => {
  const fetchPosts = async () => {
    const response = await fetch('http://localhost:3000/posts');
    if (!response.ok) throw new Error('Could not fetch posts');
    return response.json();
  };

  const posts = useQuery(['posts'], fetchPosts);

  const fetchPost = async id => {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    return response;
  };

  const usePost = id => useQuery(['post', id], () => fetchPost(id));

  return (
    <PostContext.Provider value={{ posts, usePost }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
