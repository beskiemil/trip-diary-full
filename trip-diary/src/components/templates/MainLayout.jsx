import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../organisms/Navbar';

const MainLayout = () => (
  <div>
    <Navbar />
    <main className="mx-auto flex max-w-screen-xl flex-col items-center py-12">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
