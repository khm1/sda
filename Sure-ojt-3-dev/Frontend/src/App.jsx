import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from '@emotion/styled';
import AdminLogin from './pages/AdminLogin';
import AdminTable from './pages/AdminTable';
import UserInfo from './pages/UserInfo';
import UserLogin from './pages/UserLogin';
import FirstUserStep from './pages/FirstUserStep';
import Redirect from './pages/Redirect';
import LineLogin from './pages/LineLogin';
const Wrapper = styled.div`
  max-width: 1024px;
  min-width: 300px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Routes>
          <Route path="/:id" element={<Redirect />} />
          <Route path="/" element={<UserLogin />} />
          <Route path="/userInfo" element={<UserInfo />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/adminData" element={<AdminTable />} />
          <Route path="/userStep" element={<FirstUserStep />} />
          <Route path="/lineLogin" element={<LineLogin />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}
