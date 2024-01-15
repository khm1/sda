import { produce } from 'immer';

const initialState = {
  totalPage: 1,
  currentIndex: 1,
  formList: [],
  googleFormUrl: '',
  googleFormTitle: '',
  isAdmin: false,
  // form list loading 상태
  formListLoading: false,
  formListDone: false,
  formListError: false,

  formGenerateLoading: false,
  formGenerateDone: false,
  formGenerateError: false,

  adminLoginLoading: false,
  adminLoginDone: false,
  adminLoginError: false,

  pageChangeLoading: false,
  pageChangeDone: false,
  pageChangeError: false,
};

export const FORM_LIST_REQUEST = 'FORM_LIST_REQUEST';
export const FORM_LIST_SUCCESS = 'FORM_LIST_SUCCESS';
export const FORM_LIST_FAILURE = 'FORM_LIST_FAILURE';
export const FORM_GENERATE_REQUEST = 'FORM_GENERATE_REQUEST';
export const FORM_GENERATE_SUCCESS = 'FORM_GENERATE_SUCCESS';
export const FORM_GENERATE_ERROR = 'FORM_GENERATE_ERROR';
export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_ERROR = 'ADMIN_LOGIN_ERROR';

export const FORM_CURRENT_PAGE_REQUEST = 'FORM_CURRENT_PAGE_REQUEST';
export const FORM_CURRENT_PAGE_SUCCESS = 'FORM_CURRENT_PAGE_SUCCESS';
export const FORM_CURRENT_PAGE_ERROR = 'FORM_CURRENT_PAGE_ERROR';
export const FORM_CURRENT_PAGE_CHANGE = 'FORM_CURRENT_PAGE_CHANGE';

const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FORM_LIST_REQUEST:
        draft.formListLoading = true;
        draft.formListError = null;
        draft.formListDone = false;
        break;
      case FORM_LIST_SUCCESS:
        draft.formListLoading = false;
        draft.formListDone = true;
        draft.formList = action.data.data;
        draft.totalPage = action.data.total_page;
        break;
      case FORM_LIST_FAILURE:
        draft.formListLoading = false;
        draft.formListError = action.error;
        break;
      case FORM_GENERATE_REQUEST:
        draft.formGenerateLoading = true;
        draft.formGenerateError = null;
        draft.formGenerateDone = false;
        break;
      case FORM_GENERATE_SUCCESS:
        draft.formGenerateLoading = false;
        draft.formGenerateDone = true;
        break;
      case FORM_GENERATE_ERROR:
        draft.formGenerateError = action.error;
        draft.formGenerateLoading = false;
        break;
      case ADMIN_LOGIN_REQUEST:
        draft.adminLoginLoading = true;
        draft.adminLoginError = null;
        draft.adminLoginDone = false;
        break;
      case ADMIN_LOGIN_SUCCESS:
        draft.adminLoginDone = true;
        draft.isAdmin = true;
        draft.adminLoginLoading = false;
        break;
      case ADMIN_LOGIN_ERROR:
        draft.adminLoginDone = true;
        draft.adminLoginError = true;
        break;
      case FORM_CURRENT_PAGE_REQUEST:
        draft.pageChangeLoading = true;
        draft.pageChangeError = null;
        draft.pageChangeDone = false;
        break;
      case FORM_CURRENT_PAGE_SUCCESS:
        draft.pageChangeDone = true;
        draft.pageChangeLoading = false;
        break;
      case FORM_CURRENT_PAGE_ERROR:
        draft.pageChangeError = true;
        draft.pageChangeLoading = false;
        break;
      case FORM_CURRENT_PAGE_CHANGE:
        draft.currentIndex = action.data;
        break;
    }
  });

export default reducer;
