import React, { useState } from 'react';

import styled from '@emotion/styled';

const StyledButton = styled.button`
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
  background-color: ${props => props.theme.mainColor};
  color: white;
  font-size: 16px;
  padding: 5px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${props => props.theme.subColor};
  }
`;

const StyledIconDiv = styled.div`
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function CopyButton({ text, value }) {
  const [isClicked, setIsClicked] = useState(false);
  const [Text, setText] = useState(false);
  const handleCopy = async text => {
    setIsClicked(true);
    try {
      // Clipboard API를 사용하여 텍스트를 복사합니다.
      await navigator.clipboard.writeText(text);
      setText('완료!');
    } catch (err) {
      setText('실패!');
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <>
      <StyledButton onClick={() => handleCopy(value)}>
        {/* {icon ? <StyledIconDiv>{icon}</StyledIconDiv> : null} */}
        {isClicked ? <p>{Text}</p> : <p>복사</p>}
      </StyledButton>
    </>
  );
}
