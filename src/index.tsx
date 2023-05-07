import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Home from './views/home';


//createBrowserRouterをつかって、ルーティングを定義する
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//初期インスタンス化

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
   <RouterProvider router={router}/> 
  </React.StrictMode>
);
