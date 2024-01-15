import styled from '@emotion/styled';

export const StyledInput = styled.input`
  border-radius: 8px;
  border: 1px solid ${props => props.theme.lineColor};
  background: transparent;
  outline: none;
  width: 100%;
  margin: 0 auto;
  padding: 12px;
  font-size: 16px;
  transition: all 0.2s ease-in;

  &:focus {
    background: ${props => props.theme.inputColor};
    border: 1px solid ${props => props.theme.mainColor};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  padding: 8px;
  color: ${props => props.theme.mainColor};
  text-transform: uppercase;
  font-weight: 600;
`;
