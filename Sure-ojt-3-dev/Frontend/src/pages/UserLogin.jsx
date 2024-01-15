import { useDispatch } from 'react-redux';
import loginBtn from '../assets/btn_login_base.png';

import axios from 'axios';
import Header from '../components/Header';

export default function UserLogin() {
  if (!localStorage.getItem('id')) {
    return <>잘못된 접근입니다.</>;
  }

  const LINE_CHANNEL_ID = import.meta.env.VITE_APP_LINE_CHANNEL_ID;
  const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;

  function redirectionHandler() {
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${REDIRECT_URI}&state=123123123&scope=profile`;
  }

  return (
    <>
      <Header />
      <img src={loginBtn} onClick={() => redirectionHandler()} />
    </>
  );
}
