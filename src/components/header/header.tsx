import { debounce } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/image/logo/logoNew3.png';
import {
  DEFAULT_COOKIE_OPTION,
  removeCookie,
  TOKEN_LIST,
} from '../../context/cookies';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import theme from '../../styles/theme';

const HeaderStyle = styled.header`
  position: relative;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 5rem;
  padding-top: 2rem;
  background-color: ${theme.colors.backgoundWhite};
  box-shadow: ${theme.shadow.defaultShadow};
  color: ${theme.colors.blackOne};
`;

const LogoButton = styled.button`
  margin-top: -0.5rem;
  cursor: pointer;
  font-size: 3rem;
  letter-spacing: 0.1rem;
  border: none;
  color: ${theme.fontColor.blueColor};
  font-weight: 600;
  background-color: transparent;
  float: left;
  margin-left: 3rem;
`;

const MovLogoButton = styled.button`
  cursor: pointer;
  font-size: 2rem;
  letter-spacing: 0.1rem;
  border: none;
  color: ${theme.fontColor.blueColor};
  font-weight: 600;
  background-color: transparent;
  float: left;
  margin-left: 1.5rem;
`;

const MypageButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const MovMypageButton = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  font-size: 1.4rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const SuggestionButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin-top: 0.4rem;
  background-color: transparent;
  color: black;
  -webkit-text-fill-color: rgba(0, 0, 0, 256);
  color: ${theme.colors.blackOne};
`;

const MovSuggestionButton = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  font-size: 1.4rem;
  float: right;
  border: none;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const LoginButton = styled.button`
  cursor: pointer;
  margin-right: 3rem;
  font-size: 1.8rem;
  float: right;
  background-color: transparent;
  margin-top: 0.2rem;
  border-radius: 10px;
  border-style: solid;
  color: ${theme.colors.blackOne};
`;

const MovLoginButton = styled.button`
  cursor: pointer;
  margin-right: 1.5rem;
  font-size: 1.4rem;
  float: right;
  background-color: transparent;
  margin-top: 0.2rem;
  border-radius: 10px;
  border-style: solid;
  color: ${theme.colors.blackOne};
`;

const MyMentoringButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const MovMyMentoringButton = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  font-size: 1.4rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const DataRoomButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const MovDataRoomButton = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  font-size: 1.4rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
  color: ${theme.colors.blackOne};
`;

const imagestyle = {
  height: '4rem',
  width: '4rem',
};

const movimagestyle = {
  height: '2.5rem',
  width: '2.5rem',
};

const Header = () => {
  let mdlinks = '/mentor-detail/';
  let mlinks = '/mentors/mentorings/';
  const [isClick, setIsClick] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const handleResize: any = debounce(() => {
    if (window.innerWidth < 600) setIsMobile(true);
    else setIsMobile(false);
  }, 10);

  const AlertDetail = () => {
    ErrorStore.on(
      'カデットは自動ログアウトされております!\n 9월 19~20일 comming soon~ :)',
      ERROR_DEFAULT_VALUE.TITLE,
    );
    removeCookie(TOKEN_LIST.ACCESS_TOKEN, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.INTRA_ID, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.USER_ROLE, DEFAULT_COOKIE_OPTION);
    removeCookie(TOKEN_LIST.JOIN, DEFAULT_COOKIE_OPTION);
    setIsLogin(false);
  };

  if (AuthStore.getUserRole()) {
    mdlinks = '/mentor-detail/' + AuthStore.getUserIntraId();
    mlinks = '/mentors/mentorings/' + AuthStore.getUserIntraId();
  }
  useEffect(() => {
    window.screen.width <= 600 ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener('resize', handleResize);
    {
      AuthStore.getAccessToken() ? setIsLogin(true) : setIsLogin(false);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    {
      AuthStore.getAccessToken() ? setIsLogin(true) : setIsLogin(false);
    }
  }, [isClick]);

  return (
    <div>
      {isMobile ? ( //mobile
        <HeaderStyle>
          <div className="header">
            <Link to="/" reloadDocument={true}>
              <MovLogoButton>
                <img src={logo} style={movimagestyle} className="App-logo" />
                polar
              </MovLogoButton>
            </Link>
            {isLogin ? (
              <MovLoginButton
                onClick={() => {
                  setIsClick(!isClick);
                  AuthStore.Logout();
                }}
              >
                ログアウト
              </MovLoginButton>
            ) : (
              <MovLoginButton
                onClick={() => {
                  setIsClick(!isClick);
                  AuthStore.Login();
                }}
              >
                ログイン
              </MovLoginButton>
            )}
            {AuthStore.getUserRole() === USER_ROLES.CADET ? (
              <div>
                {/*<div>{AlertDetail()}</div>*/}
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MovSuggestionButton>お問合せ</MovSuggestionButton>
                  <Link to={'/cadets/mentorings'}>
                    <MovMyMentoringButton>マイページ</MovMyMentoringButton>
                  </Link>
                </a>
              </div>
            ) : AuthStore.getUserRole() === USER_ROLES.MENTOR ? (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MovSuggestionButton>お問合せ</MovSuggestionButton>
                </a>
                <Link to={mlinks}>
                  <MovMyMentoringButton>私のメンタリング</MovMyMentoringButton>
                </Link>
                <Link to={mdlinks}>
                  <MovMypageButton>マイページ</MovMypageButton>
                </Link>
              </div>
            ) : AuthStore.getUserRole() === USER_ROLES.BOCAL ? (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MovSuggestionButton>お問合せ</MovSuggestionButton>
                </a>
                <Link to="/data-room" reloadDocument={true}>
                  <MovDataRoomButton>データルーム</MovDataRoomButton>
                </Link>
              </div>
            ) : (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MovSuggestionButton>お問い合わせ</MovSuggestionButton>
                </a>
              </div>
            )}
          </div>
        </HeaderStyle>
      ) : (
        //pc
        <HeaderStyle>
          <div className="header">
            <Link to="/" reloadDocument={true}>
              <LogoButton>
                <img src={logo} style={imagestyle} className="App-logo" />
                polar
              </LogoButton>
            </Link>
            {isLogin ? (
              <LoginButton
                onClick={() => {
                  setIsClick(!isClick);
                  AuthStore.Logout();
                }}
              >
                ログアウト
              </LoginButton>
            ) : (
              <LoginButton
                onClick={() => {
                  setIsClick(!isClick);
                  AuthStore.Login();
                }}
              >
                ログイン
              </LoginButton>
            )}
            {AuthStore.getUserRole() === USER_ROLES.CADET ? (
              <div>
                {/* <div>
                  {AlertDetail()}
                </div> */}
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SuggestionButton>お問合せ</SuggestionButton>
                  <Link to={'/cadets/mentorings'}>
                    <MyMentoringButton>マイページ</MyMentoringButton>
                  </Link>
                </a>
              </div>
            ) : AuthStore.getUserRole() === USER_ROLES.MENTOR ? (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SuggestionButton>お問合せ</SuggestionButton>
                </a>
                <Link to={mlinks}>
                  <MyMentoringButton>私のメンタリング</MyMentoringButton>
                </Link>
                <Link to={mdlinks}>
                  <MypageButton>マイページ</MypageButton>
                </Link>
              </div>
            ) : AuthStore.getUserRole() === USER_ROLES.BOCAL ? (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SuggestionButton>お問合せ</SuggestionButton>
                </a>
                <Link to="/data-room" reloadDocument={true}>
                  <DataRoomButton>データルーム</DataRoomButton>
                </Link>
              </div>
            ) : (
              <div>
                <a
                  href={`${process.env.REACT_APP_BASE_FORM_URL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SuggestionButton>お問合せ</SuggestionButton>
                </a>
              </div>
            )}
          </div>
        </HeaderStyle>
      )}
    </div>
  );
};

export default Header;
