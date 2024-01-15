import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import SearchAddress from './SearchAddress';
import { Label } from '../style/Input.styles';

const StyledSelect = styled.select`
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

const StyledOption = styled.option`
  border-radius: 8px;
  border: 1px solid ${props => props.theme.lineColor};
  background: transparent;
  outline: none;
  width: 100%;
  margin: 0 auto;
  height: 36px;
  padding: 8px;
  transition: all 0.2s ease-in;
  &:focus {
    background: ${props => props.theme.subColor};
    border: 1px solid ${props => props.theme.mainColor};
  }
`;

export default function AddressDropdown({
  label,
  name,
  options = [],
  onNewAddress,
}) {
  const [selectedAddress, setSelectedAddress] = useState('');

  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  const handleSelectChange = event => {
    const selectedAddrId = event.target.value;
    setSelectedAddress(selectedAddrId);

    if (selectedAddrId === 'add-new') {
      setShowNewAddressInput(true);
    } else {
      setShowNewAddressInput(false);
      onNewAddress(selectedAddrId);
    }
  };

  useEffect(() => {
    if (!selectedAddress) {
      const defaultSelectedAddr = options.find(option => option.selected);
      if (defaultSelectedAddr) {
        setSelectedAddress(defaultSelectedAddr.value);
      }
    }
  }, [options, selectedAddress]);

  // 새 주소 정보 처리를 위한 함수
  const handleNewAddress = newAddressData => {
    if (onNewAddress) {
      onNewAddress(newAddressData);
    }
  };

  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      <StyledSelect
        name={name}
        value={selectedAddress}
        onChange={handleSelectChange}
      >
        {options.map(option => (
          <StyledOption value={option.value} key={option.value}>
            {option.label}
          </StyledOption>
        ))}
        <StyledOption value="add-new">새 주소 추가</StyledOption>
      </StyledSelect>
      {showNewAddressInput && (
        <SearchAddress onAddressSelect={handleNewAddress} />
      )}
    </>
  );
}
