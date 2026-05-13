"use client";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import "cropperjs/dist/cropper.min.css";

import './globals.css'
import { useEffect } from 'react'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])
  return (
    <html lang="en">
    <body>
      {children}
      <ToastContainer
          position="top-right"
          autoClose={3000}
        />
    </body>
  </html>
  );
}
