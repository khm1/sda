import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { ADMIN_LOGIN_REQUEST } from '../store/modules/admin';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import sureLogo from '../assets/sureform-long.svg';

const LoginWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media ${props => props.theme.tablet} {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StyledDiv = styled.div`
  flex: 1;
  margin-right: 50px;
  @media ${props => props.theme.tablet} {
    margin-bottom: 50px;
    margin-right: 0px;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fit;
`;

const StyledInputDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
`;

const StyledHeading1 = styled.h1`
  font-weight: 500;
  margin-bottom: 20px;
`;

const StyledButtonContainer = styled.div`
  margin-top: 30px;
`;

export default function AdminLogin() {
  const [data, setData] = useState({
    id: '',
    password: '',
  });
  const dispatch = useDispatch();
  const { adminLoginLoading, adminLoginDone } = useSelector(
    state => state.admin,
  );
  const navi = useNavigate();
  function dispatchAdminLogin() {
    dispatch({
      type: ADMIN_LOGIN_REQUEST,
      data: data,
    });
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // 로그인 요청 후 성공하면 이동.
  // admin 정보 조회
  useEffect(() => {
    if (adminLoginDone === true) {
      navi('/adminData');
    }
  }, [adminLoginDone]);

  return (
    <LoginWrapper>
      <StyledDiv>
        <StyledImage src={sureLogo} />
      </StyledDiv>
      <StyledInputDiv>
        <StyledHeading1>ADMIN LOGIN</StyledHeading1>
        <Input label="ID" name="id" value={data.id} onChange={handleChange} />
        <Input
          label="PASSWORD"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
        <StyledButtonContainer>
          <Button text="로그인" onClick={dispatchAdminLogin} />
        </StyledButtonContainer>
      </StyledInputDiv>
    </LoginWrapper>
  );
}
