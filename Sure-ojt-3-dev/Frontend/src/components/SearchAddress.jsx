import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { StyledButton } from '../style/Button.styles';
import { StyledInput } from '../style/Input.styles';
import Modal from '../../hooks/useModal';
const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
`;

const APIdiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function SearchAddress({ onAddressSelect }) {
  // 주소 관련
  const [addressCode, setAddressCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrap = useRef(null);

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
    if (onAddressSelect) {
      onAddressSelect({
        addressCode,
        address,
        detailAddress: updatedDetailAddress,
        extraAddress,
      });
    }
  };

  const handleAddressAPI = () => {
    if (!isLoaded || !wrap.current) return;
    const element_wrap = wrap.current;
    const currentScroll = Math.max(
      document.body.scrollTop,
      document.documentElement.scrollTop,
    ); // 스크롤 위치 조절
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
        document.body.scrollTop = currentScroll;
        setIsOpen(false);
        // 상위 컴포넌트에 주소 정보 전달
        if (onAddressSelect) {
          onAddressSelect({
            addressCode : zonecode,
            address: addr,
            detailAddress,
            extraAddress,
          });
        }
      },
      function(size) {
        element_wrap.style.height = size.height + 'px';
      },
      width: '350px',
      borderRadiust: '3px black',
    }).embed(element_wrap);

    element_wrap.style.display = 'block';
  };

  function foldDaumPostcode() {
    setIsOpen(false);
  }

  useEffect(() => {
    handleAddressAPI();
  }, [isOpen]);

  return (
    <>
      <StyledDiv>
        <StyledInput
          type="text"
          readOnly
          value={addressCode}
          placeholder="우편번호"
        />
        <StyledButton type="button" onClick={() => setIsOpen(true)}>
          우편번호 찾기
        </StyledButton>
      </StyledDiv>
      {isOpen ? (
        <Modal onClick={() => setIsOpen(false)}>
          <div ref={wrap}>
            <img
              src="//t1.daumcdn.net/postcode/resource/images/close.png"
              id="btnFoldWrap"
              style={{
                cursor: 'pointer',
                position: 'absolute',
                zIndex: '1',
                right: '-1px',
              }}
              onClick={() => foldDaumPostcode(wrap)}
              alt="접기 버튼"
            />
          </div>
        </Modal>
      ) : null}
      <StyledInput type="text" readOnly value={address} placeholder="주소" />

      <StyledInput
        type="text"
        value={detailAddress}
        onChange={handleDetailAddressChange}
        placeholder="상세주소를 입력해주세요"
      />

      <StyledInput
        type="text"
        readOnly
        value={extraAddress}
        placeholder="참고항목"
      />
    </>
  );
}
