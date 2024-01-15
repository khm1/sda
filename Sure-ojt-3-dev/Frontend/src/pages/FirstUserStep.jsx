import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import StepInput from '../components/StepInput';
import StepAddress from '../components/StepAddress';
import { useSelector } from 'react-redux';
import { createUserAPI } from '../store/apis/user';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const StyledDiv = styled.div`
  width: 90%;
  max-width: 500px;
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  @media ${props => props.theme.tablet} {
    height: 90%;
    form {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100vw;
  position: fixed;
  top: 52px;
  font-weight: 600;
  font-size: 0.8rem;
  overflow: hidden;
  height: 10px;
  background-color: ${props => props.theme.subColor};
  @media ${props => props.theme.tablet} {
    width: 100%;
    /* border-radius: 12px; */
  }
`;

const Progress = styled.div`
  width: ${props => props.width}%;
  height: 30px;
  padding: 0;
  text-align: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: linear-gradient(90deg, transparent, #002878, transparent);
  background-size: 200% 100%;
  animation: shine 3s linear infinite;
  transition: 2s;
  @keyframes shine {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function FirstUserStep() {
  const [data, setData] = useState({});
  const [step, setStep] = useState('name');
  const user = useSelector(state => state.user.user);
  const navi = useNavigate();

  const stepIndex = {
    name: 3,
    phone: 2,
    email: 1,
    address: 0,
  };
  const a = String(100 - (stepIndex[step] * 100) / 3);
  console.log(a);
  return (
    <>
      <Header />
      <StyledDiv>
        {step === 'name' && (
          <StepInput
            title="이름을 입력해주세요"
            onNext={value => {
              setStep('phone');
              setData(prev => ({ ...prev, name: value }));
            }}
          />
        )}
        {step === 'phone' && (
          <StepInput
            title="전화번호를 입력해주세요"
            onNext={value => {
              setStep('email');
              setData(prev => ({ ...prev, phone: value }));
            }}
          />
        )}
        {step === 'email' && (
          <StepInput
            title="이메일을 입력해주세요"
            type="email"
            onNext={value => {
                setStep('address');
                setData(prev => ({ ...prev, email: value }))
              }}
          />
        )}
        {step === 'address' && (
          <StepAddress
            title="주소를 입력해주세요"
            onNext={async value => {
                setData(prev => ({
                  ...prev,
                  address:
                    value.address +
                    ' ' +
                    value.detailAddress +
                    ' ' +
                    value.extraAddress,
                  addressNumber: value.addressCode,
                }));
                //dispathch -> 주소,
                const userData = {
                  userId: user.userId,
                  name: data.name,
                  phone: data.phone,
                  addressNumber: value.addressCode,
                  address: value.address +
                  ' ' +
                  value.detailAddress +
                  ' ' +
                  value.extraAddress,
                  email: data.email,
                };
                console.log(userData);
                await createUserAPI(userData);
                navi('/userInfo');
              }}/>
        )}
      </StyledDiv>
    </>
  );
}
