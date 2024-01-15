import React from 'react';
import styled from '@emotion/styled';
import sureform from '../assets/sureform.svg';

const HeaderStyle = styled.header`
  height: 52px;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 35%;
  margin: 0 auto;
`;

export default function Header() {
  return (
    <HeaderStyle>
      <Logo src={sureform} />
    </HeaderStyle>
  );
}
