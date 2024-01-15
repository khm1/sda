import { ToastContainer, toast } from 'react-toastify';

import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
export default function Toast() {
  const notify = () => toast('Wow so easy!');

  useEffect(() => {
    notify;
  });

  return <ToastContainer />;
}
