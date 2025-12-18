import React from 'react';
import { Outlet } from 'react-router-dom';
import Index from '../components/header';
import { useAuthInit } from '../hooks/useAuthInit.ts';

function MainLayout() {
  useAuthInit();

  return (
    <>
      <Index />
      <Outlet />
    </>
  );
}

export default MainLayout;
