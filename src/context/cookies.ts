import { Cookies } from 'react-cookie';

const cookies = new Cookies();

/**
 * １日を秒で変換
 * 60 * 60 * 24
 */
const DAY_TO_SECOND = 86400;

/**
 * クッキーの名称リスト
 */
export const TOKEN_LIST = {
  ACCESS_TOKEN: 'access_token',
  USER_ROLE: 'user_role',
  INTRA_ID: 'intra_id',
  JOIN: 'info_join',
};

/**
 * クッキーのオプション
 */
export interface COOKIE_OPTION {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
}

/**
 * クッキーの基本セット
 */
export const DEFAULT_COOKIE_OPTION: COOKIE_OPTION = {
  path: '/',
  maxAge: DAY_TO_SECOND,
};

/**
 * トークン設定関数
 * @param tokenName トークン名
 * @param value トークンの値
 * @param option オプション
 * example) { path: '/', secure: true, sameSite: "none" }
 */
export const setCookie = (
  tokenName: string,
  value: string,
  option?: COOKIE_OPTION,
) => {
  cookies.set(tokenName, value, { ...option });
};

/**
 * トークン取得関数
 * @param tokenName トークン名
 * @returns トークン名に対応するクッキーの値
 */
export const getCookie = (tokenName: string) => {
  return cookies.get(tokenName);
};

/**
 * トークン削除関数
 * @param tokenName トークン名
 * @param option オプション
 */
export const removeCookie = (tokenName: string, option?: COOKIE_OPTION) => {
  cookies.remove(tokenName, { ...option });
};

/* option example */
// { path: '/', secure: true, sameSite: "none" }
