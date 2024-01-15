import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Redirect() {
  const { id } = useParams();
  const navi = useNavigate();

  if (id === null || id === undefined || isNaN(parseInt(id)) === true) {
    alert('잘못된 접근입니다.');
    navi('/');
  } else {
    localStorage.setItem('id', id);
  }

  useEffect(() => {
    navi('/');
  });

  return <div>Redirect</div>;
}
