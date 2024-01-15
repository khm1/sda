import React from 'react';
import { StyledInput, Label } from '../style/Input.styles.js';

export default function Input({ label, name, value, onChange, placeholder }) {
  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      <StyledInput
        type={name === 'password' ? 'password' : 'text'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
}
