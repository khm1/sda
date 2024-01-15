import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import axios from 'axios';
import { StyledButton } from '../style/Button.styles';
import { StyledInput } from '../style/Input.styles';

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
`;

const Heading1 = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 30px;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function StepAddress({ onAddressSelect, onNext }) {
  // 주소 관련
  const [addressCode, setAddressCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDaumPostcodeScript = () => {
      const script = document.createElement('script');
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    };

    if (!window.daum || !window.daum.Postcode) {
      loadDaumPostcodeScript();
    } else {
      setIsLoaded(true);
    }
  }, []);

  // 상세주소 입력 처리 함수
  const handleDetailAddressChange = e => {
    const updatedDetailAddress = e.target.value;
    setDetailAddress(updatedDetailAddress);

    // 전체 주소 정보를 상위 컴포넌트에 전달
  };

  function handler(e) {
    e.preventDefault();
    onNext({
      addressCode,
      address,
      detailAddress,
      extraAddress,
    });
  }

  const handleAddressAPI = () => {
    if (!isLoaded) return;

    new window.daum.Postcode({
      oncomplete: async data => {
        const {
          zonecode,
          roadAddress,
          jibunAddress,
          bname,
          buildingName,
          apartment,
        } = data;
        const userSelectedType = data.userSelectedType;

        const addr = userSelectedType === 'R' ? roadAddress : jibunAddress;

        let extraAddr = '';
        if (userSelectedType === 'R') {
          if (bname !== '' && /[동|로|가]$/g.test(bname)) {
            extraAddr += bname;
          }
          if (buildingName !== '' && apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + buildingName : buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        setAddressCode(zonecode);
        setAddress(addr);
        setExtraAddress(extraAddr);
      },
    }).open();
  };

  return (
    <>
      <Heading1>주소를 입력해주세요</Heading1>
      <form onSubmit={e => handler(e)}>
        <Wrapper>
          <StyledDiv>
            <StyledInput
              type="text"
              readOnly
              value={addressCode}
              placeholder="우편번호"
            />
            <StyledButton type="button" onClick={() => handleAddressAPI()}>
              우편번호 찾기
            </StyledButton>
          </StyledDiv>
          <StyledInput
            type="text"
            readOnly
            value={address}
            placeholder="주소"
          />
          <StyledInput
            type="text"
            value={detailAddress}
            onChange={e => handleDetailAddressChange(e)}
            placeholder="상세주소를 입력해주세요"
          />
          <StyledInput
            type="text"
            readOnly
            value={extraAddress}
            placeholder="참고항목"
          />
        </Wrapper>
        <StyledButton>확인</StyledButton>
      </form>
    </>
  );
}
