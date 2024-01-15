import React, { useEffect } from 'react';
import axios from 'axios';

export default function Example() {
  useEffect(() => {
    const requset = async () => {
      const res = await axios.get('http://localhost:8000/admin/form');
      console.log(res.data, '결과');
    };
    requset();
  }, []);

  return <div>Example</div>;
}
