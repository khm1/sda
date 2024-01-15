import React, { useState } from 'react';
import { StyledButton, StyledIconDiv } from '../style/Button.styles';
StyledButton;

export default function Button({ icon, text, onClick }) {
  return (
    <StyledButton onClick={onClick}>
      {icon ? <StyledIconDiv>{icon}</StyledIconDiv> : null}
      <p>{text}</p>
    </StyledButton>
  );
}
