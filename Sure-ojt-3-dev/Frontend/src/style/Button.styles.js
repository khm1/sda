import styled from '@emotion/styled';

export const StyledButton = styled.button`
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
  background-color: ${props => props.theme.mainColor};
  color: white;
  font-size: 16px;
  padding: 12px;
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

export const StyledIconDiv = styled.div`
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
