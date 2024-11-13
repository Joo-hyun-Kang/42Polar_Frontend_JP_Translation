import { action, makeObservable } from 'mobx';
import {
  axiosWithNoData,
  AXIOS_METHOD_WITH_NO_DATA,
} from '../../context/axios-interface';
import {
  DEFAULT_COOKIE_OPTION,
  getCookie,
  removeCookie,
  TOKEN_LIST,
} from '../../context/cookies';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../error/ErrorStore';

export interface User {
  intraId: string;
  role: string;
  join: string;
}

export const USER_ROLES = {
  MENTOR: 'mentor',
  CADET: 'cadet',
  BOCAL: 'bocal',
};

/**
 * TODO: NEED REFACTOR
 */
class AuthStore {
  constructor() {
    makeObservable(this, {
      Login: action,
      Logout: action,
      getAccessToken: action,
      getUserIntraId: action,
      getUserRole: action,
    });
  }

  /**
   * ログアウト、トークンおよびAuthStoreの値を初期化
   */
  async Logout() {
    removeCookie(TOKEN_LIST.ACCESS_TOKEN, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.INTRA_ID, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.USER_ROLE, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.JOIN, DEFAULT_COOKIE_OPTION);
    window.location.reload();
  }

  /**
   * ログイン、トークンおよびAuthStoreの値を設定
   */
  Login() {
    //axiosInstance
    //  .get('login')
    axiosWithNoData(AXIOS_METHOD_WITH_NO_DATA.GET, 'login')
      .then(res => {
        document.location.href = res.data;
      })
      .catch(err => {
        ErrorStore.on(err?.response?.data?.message, ERROR_DEFAULT_VALUE.TITLE);
      });
  }

  /**
   *  テスト用のログインモック関数
   */
  //Login() {
  //  setCookie(TOKEN_LIST.ACCESS_TOKEN, '', DEFAULT_COOKIE_OPTION);
  //  setCookie(TOKEN_LIST.INTRA_ID, '', DEFAULT_COOKIE_OPTION);
  //  setCookie(TOKEN_LIST.USER_ROLE, '', DEFAULT_COOKIE_OPTION);
  //  window.location.reload();
  //}

  /**
   * @returns  クッキーに保存されているアクセストークンを取得。存在しない場合はundefinedを返します
   */
  getAccessToken() {
    return getCookie(TOKEN_LIST.ACCESS_TOKEN);
  }

  /**
   * @returns (クッキー)ログイン済みユーザーのイントラIDを取得。存在しない場合はundefinedを返します
   */
  getUserIntraId() {
    return getCookie(TOKEN_LIST.INTRA_ID);
  }

  /**
   * @returns (クッキー)ログイン済みユーザーのROLEを取得。存在しない場合はundefinedを返します
   */
  getUserRole() {
    return getCookie(TOKEN_LIST.USER_ROLE);
  }

  /**
   * @returns  (クッキー)ログイン済みユーザーのJOINを取得。存在しない場合はundefinedを返します
   */
  getUserJoin() {
    return getCookie(TOKEN_LIST.JOIN);
  }
}

export default new AuthStore();
