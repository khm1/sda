import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOG_IN_REQUEST } from '../store/modules/user';
import axios from 'axios';

export default function LineLogin() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const { logInDone, isUser, logInLoading } = useSelector(state => state.user);
  const LINE_CHANNEL_ID = import.meta.env.VITE_APP_LINE_CHANNEL_ID;
  const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;
  const VITE_APP_LINE_CHANNEL_SECREAT = import.meta.env
    .VITE_APP_LINE_CHANNEL_SECREAT;
  async function callbackHandler(code) {
    const response = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: LINE_CHANNEL_ID,
        redirect_uri: REDIRECT_URI,
        client_secret: VITE_APP_LINE_CHANNEL_SECREAT,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken = response.data.access_token;
    dispatch({
      type: LOG_IN_REQUEST,
      data: accessToken,
    });
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      callbackHandler(code);
    }
  });
  useEffect(() => {
    if (logInDone) {
      if (isUser) {
        navi('/userInfo');
      } else {
        navi('/userStep');
      }
    }
  }, [logInDone]);

  return <>로딩즁...❤️</>;
}
