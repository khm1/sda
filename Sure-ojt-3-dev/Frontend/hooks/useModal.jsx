import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 350px;
  height: 100%;
  /* width: 90%; */
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
  align-items: center;
  justify-content: center;
`;

const BackDrop = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #00000074;
  opacity: 40;
`;

// 위치를 절대 위치로 잡고, 자동으로 닫고 끌 수 있도록 만들어준다.
export default function Modal({ children, onClick }) {
  useEffect(() => {}, []);
  const portalElement = document.getElementById('modal');
  return (
    <>
      {createPortal(
        <>
          <BackDrop onClick={onClick} />
          <Wrapper>{children}</Wrapper>
        </>,
        portalElement,
      )}
    </>
  );
}
