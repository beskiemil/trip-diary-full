import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/templates/MainLayout';
import AuthProvider from './Providers/AuthProvider';
import PostProvider from './Providers/PostProvider';
import Edytuj from './views/Edytuj';
import Galeria from './views/Galeria';
import Home from './views/Home';
import Post from './views/Post';
import UtworzPost from './views/UtworzPost';
import Zaloguj from './views/Zaloguj';
import Zarejestruj from './views/Zarejestruj';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PostProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="/zaloguj" element={<Zaloguj />} />
                <Route path="/zarejestruj" element={<Zarejestruj />} />
                <Route path="/utworz_post" element={<UtworzPost />} />
                <Route path="/posts/:postId" element={<Post />} />
                <Route path="/edytuj/:postId" element={<Edytuj />} />
              </Route>
            </Routes>
          </PostProvider>
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
