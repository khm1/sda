import { ToastContainer, toast } from 'react-toastify';

import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
export default function Toast() {
  const notify = () => toast('마지막으로 확인해주세요!');

  useEffect(() => {
    notify();
  }, []);

  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastStyle={{
        backgroundColor: '#002878',
        color: 'white',
        fontWeight: 700,
      }}
      progressStyle={{
        backgroundColor: '#7B97CE',
      }}
    />
  );
}
