import { useEffect } from 'react';

export default function hoc(Children, option, adminRoute = null) {
  function AuthenticationCheck() {
    // useNavi
    //  로그인 정보 : isAuth
    const isAuth = true; // -> 변경해야함, store 연동 후 정보 가져오기
    const isAdmin = false; // 어드민 권한 여부
    useEffect(() => {
      // 유저 정보 조회 또는
      // 권한 조회후,

      if (!isAuth) {
        // option -> 로그인한 유저만 이동 가능한 페이지라면
        if (option) {
          console.log('로그인 페이지로 이동');
        }
      } else {
        // 로그인 한 유저일 경우
        if (adminRoute && !isAdmin) {
          console.log('이전페이지 또는 홈페이지로 이동');
        } else {
          if (option === false) {
            // 로그인한 유저는 불가능한 페이지라면,
            console.log('홈페이지 또는 이전페이지 기능여부 자유');
          }
        }
      }
    }, []);
    return <Children />;
  }

  return AuthenticationCheck;
}
