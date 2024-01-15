import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import AddressDropdown from '../components/AddressDropdown';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAddressAPI,
  getUserDataAPI,
  updateUserDataAPI,
} from '../store/apis/user';
import { getEntry } from '../store/apis/form';
import Header from '../components/Header';
import Toast from '../components/toast/Toast';

const StyledDiv = styled.div`
  width: 90%;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

export default function UserInfo() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [localUser, setLocalUser] = useState({ ...user });
  const [newAddress, setNewAddress] = useState(null); // 새 주소 정보를 위한 상태

  useEffect(() => {
    dispatch({ type: 'USER_REQUEST', data: user.userId });
  }, [user.userId]);

  useEffect(() => {
    if (user && user.addresses) {
      // 'selected'가 true인 주소 찾기
      const selectedAddress = user.addresses.find(
        addr => addr.selected === 'true',
      );

      // 'selectedAddrId'와 다른 필드들을 'localUser' 상태에 설정
      setLocalUser({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        addresses: user.addresses,
        selectedAddrId: selectedAddress ? selectedAddress.addrId : null,
      });
    }
  }, [user]);

  // addresses 배열을 드롭다운 옵션으로 변환
  const addressOptions = user.addresses
    .map(addr => ({
      value: addr.addrId,
      label: addr.address,
      selected: addr.selected === 'true',
    }))
    .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1));

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalUser({ ...localUser, [name]: value });
  };

  /**
   *  newAddress 상태일 때는 {addresscode, address, detailAddress, extraAddress가 옴}
   * 기존 field일 경우에는 selectedAddrId가 옴
   */
  const handleNewAddress = data => {
    console.log(data);
    // 기존 주소가 선택된 경우
    if (typeof data === 'string') {
      setLocalUser(prevState => ({
        ...prevState,
        selectedAddrId: data,
      }));
      setNewAddress(null);
    } else {
      // '새 주소 추가'가 선택된 경우
      setNewAddress(data);
      setLocalUser(prevState => ({
        ...prevState,
        selectedAddrId: '',
      }));
    }
    // console.log(localUser);
  };

  const handleConfirm = async () => {
    let newAddressId = null;
    // 새 주소 추가 시
    if (newAddress) {
      // 새 주소 정보를 사용하여 주소 추가 API 호출
      const data = {
        userId: user.userId,
        addressNumber: newAddress.addressCode,
        address:
          newAddress.address +
          ' ' +
          newAddress.detailAddress +
          ' ' +
          newAddress.extraAddress,
      };
      const result = await addAddressAPI(data);
      newAddressId = result.data.addressId;
    }

    let selectedAddrId = newAddress ? newAddressId : localUser.selectedAddrId;

    // 사용자 데이터 업데이트
    const userData = {
      userId: user.userId,
      name: localUser.name,
      phone: localUser.phone,
      addrId: selectedAddrId,
      email: localUser.email,
    };

    // 사용자 데이터 업데이트 API 호출
    await updateUserDataAPI(userData);
    const result = await getEntry(localStorage.getItem('id'));
    
    const originURL = result.data.received_url.split('?')[0];
    let baseURL = originURL + '?usp==pp_url&';
    const udata = await getUserDataAPI(user.userId);
    const entryHead = 'entry.';
  
    const selectedAddress = udata.data.addresses.filter((v, i) => {
      if (v.selected === 'true') {
        return v;
      }
    });

    const address = encodeURIComponent(selectedAddress[0].address);

    const baseHead = {
      nameEntry: userData.name,
      phoneEntry: userData.phone,
      addrNumberEntry: selectedAddress[0].addressNumber,
      addrEntry: address,
      emailEntry: userData.email,
    };
    let URL = baseURL;
    Object.keys(baseHead).map((v, i) => {
      if (result.data[v] !== '') {
        console.log(result.data[v]);
        URL = URL + entryHead + result.data[v] + '=' + baseHead[v] + '&';
      }
    });
    // window.open(URL, '_blank');
    window.location.href = URL
  };

  return (
    <>
      <Header />
      {/* <Toast /> */}
      <StyledDiv>
        <Input
          label="이름"
          name="name"
          value={localUser.name}
          onChange={handleChange}
        />
        <Input
          label="전화번호"
          name="phone"
          value={localUser.phone}
          onChange={handleChange}
        />
        <AddressDropdown
          label="주소"
          name="address"
          options={addressOptions}
          onNewAddress={handleNewAddress}
        />

        <Input
          label="이메일"
          name="email"
          value={localUser.email}
          onChange={handleChange}
        />

        <ButtonContainer>
          <Button text="확인" onClick={handleConfirm} />
        </ButtonContainer>
      </StyledDiv>
    </>
  );
}
