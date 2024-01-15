import { HttpResponse } from 'msw';

export const mockGetAdminForm = () => {
  return HttpResponse.json({
    total_page: 4,
    data: [
      {
        id: '16',
        urlName: '11',
        received_url: '11',
        generated_url: '11',
      },
      {
        id: '17',
        urlName: '11',
        received_url: '11',
        generated_url: '11',
      },
    ],
  });
};

export const mockLinkGenerator = () => {
  return HttpResponse.json({
    generated_url: 'www.sureform.com/1',
  });
};

export const mockGetEntry = () => {
  return HttpResponse.json({
    received_url:
      'https://docs.google.com/forms/d/e/1FAIpQLSfGIeM6171yfgh9QJrEkRhh4O4xf4WWLwtM_6ML9-OQM8f3vw/viewform?usp=sf_link',
    nameEntry: '1460201814',
    phoneEntry: '',
    addrNumberEntry: '',
    addrEntry: '',
    emailEntry: '',
  });
};

export const mockCreateUserInfo = () => {
  console.log('mockCreateUserInfo');
  return new HttpResponse(null, { status: 200 });
};

export const mockUpdateUserData = () => {
  console.log('mockAdmin');
  return new HttpResponse(null, { status: 200 });
};

export const mockUserLogin = () => {
  return HttpResponse.json({
    userId: 'asdf',
    isUser: true,
    status: 200,
  });
};

export const mockGetUserData = () => {
  return HttpResponse.json({
    name: '박정은',
    phone: '01022222222',
    email: 'je@naver.com',
    addresses: [
      {
        addrId: '1',
        address: '경기도',
        addressNumber: '50123',
        selected: 'true',
      },
      {
        addrId: '2',
        address: '강원도',
        addressNumber: '10230',
        selected: 'false',
      },
    ],
  });
};

export const mockPostAdminLogin = () => {
  console.log('mockadmin Login');
  return new HttpResponse(null, { status: 200 });
};

export const mockPostAddAdress = () => {
  return HttpResponse.json({
    addressId: 10,
  });
};
