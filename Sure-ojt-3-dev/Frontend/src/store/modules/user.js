import { produce } from 'immer';

const initialState = {
  user: {
    userId: '',
    name: '',
    phone: '',
    email: '',
    addresses: [],
  },
  isUser: undefined,

  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,

  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,

  getUserLoading: false, // 사용자 정보 가져오기
  getUserDone: false,
  getUserError: false,

  updateUserLoading: false, // 사용자 정보 업데이트
  updateUserDone: false,
  updateUserError: false,

  addAddressLoading: false, // 새 주소 추가
  addAddressDone: false,
  addAddressError: false,
};

// 액션 타입
// 로그인
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

// 로그아웃
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

// 회원 정보 불러오기
export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

// 회원 정보 업데이트
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

// 새 주소 생성
export const ADD_ADDRESS_REQUEST = 'ADD_ADDRESS_REQUEST';
export const ADD_ADDRESS_SUCCESS = 'ADD_ADDRESS_SUCCESS';
export const ADD_ADDRESS_FAILURE = 'ADD_ADDRESS_FAILURE';

// 액션 생성자 타입
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.user.userId = action.data.userId;
        draft.isUser = action.data.isUser;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutError = null;
        draft.logOutDone = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.user = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case USER_REQUEST:
        draft.getUserLoading = true;
        draft.getUserError = null;
        draft.getUserDone = false;
        break;
      case USER_SUCCESS:
        draft.user.id = action.data.id;
        draft.user.name = action.data.name;
        draft.user.email = action.data.email;
        draft.user.addresses = action.data.addresses;
        draft.user.phone = action.data.phone;
        break;
      case USER_FAILURE:
        draft.getUserLoading = false;
        draft.getUserError = action.error;
        break;
      case UPDATE_USER_REQUEST:
        draft.updateUserLoading = true;
        draft.updateUserError = null;
        draft.updateUserDone = false;
        break;
      case UPDATE_USER_SUCCESS:
        draft.updateUserLoading = false;
        draft.updateUserDone = true;
        break;
      case UPDATE_USER_FAILURE:
        draft.updateUserLoading = false;
        draft.updateUserError = action.error;
        break;
      case ADD_ADDRESS_REQUEST:
        draft.addAddressLoading = true;
        draft.addAddressError = null;
        draft.addAddressDone = false;
        break;
      case ADD_ADDRESS_SUCCESS:
        draft.addAddressLoading = false;
        draft.addAddressDone = true;
        break;
      case ADD_ADDRESS_FAILURE:
        draft.addAddressLoading = false;
        draft.addAddressError = action.error;
        break;
    }
  });

export default reducer;
