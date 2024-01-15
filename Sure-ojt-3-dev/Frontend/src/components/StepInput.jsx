import React, { useState } from 'react';
import { StyledInput } from '../style/Input.styles';
import { StyledButton } from '../style/Button.styles';
import styled from '@emotion/styled';

const Heading1 = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 30px;
`;

const FixedButtonContainer = styled.div`
  margin-top: 10px;
`;

export default function StepInput({ title, onNext, type = 'text' }) {
  const [value, setValue] = useState('');

  return (
    <>
      <Heading1>{title}</Heading1>
      <form
        onSubmit={e => {
          e.preventDefault();
          onNext(value);
        }}
      >
        <StyledInput
          type={type}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
        <FixedButtonContainer>
          <StyledButton>확인</StyledButton>
        </FixedButtonContainer>
      </form>
    </>
  );
}
