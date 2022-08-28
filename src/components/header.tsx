import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/image/logo/logo.png';
import AuthStore from '../states/auth/AuthStore';
import theme from '../styles/theme';

const HeaderStyle = styled.header`
  position: relative;
  transform: translateY(0%);
  top: 0;
  z-index: 10;
  width: 100%;
  height: 5rem;
  padding-top: 2rem;
  background-color: ${theme.colors.backgoundWhite};
  box-shadow: ${theme.shadow.defaultShadow};
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
const MypageButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin: 10;
  margin-top: 0.4rem;
  background-color: transparent;
`;
const SuggestionButton = styled.button`
  cursor: pointer;
  padding-right: 2rem;
  font-size: 1.8rem;
  float: right;
  border: none;
  margin-top: 0.4rem;
  background-color: transparent;
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
`;

const imagestyle = {
  height: '4rem',
  width: '4rem',
};

const Header = () => {
  let links: string;
  AuthStore.getUserRole()
    ? (links = '/mentor-detail/' + AuthStore.getUserIntraId())
    : '';
  return (
    <HeaderStyle>
      <div className="header">
        <Link to="/">
          <LogoButton>
            <img src={logo} style={imagestyle} className="App-logo" />
            polar
          </LogoButton>
        </Link>
        {AuthStore.getAccessToken() ? (
          <LoginButton
            onClick={() => {
              AuthStore.Logout();
            }}
          >
            로그아웃
          </LoginButton>
        ) : (
          <LoginButton
            onClick={() => {
              AuthStore.Login();
            }}
          >
            로그인
          </LoginButton>
        )}
        {AuthStore.getUserRole() === 'cardet' ? (
          <div>
            <Link to="/suggestion">
              <SuggestionButton>건의사항</SuggestionButton>
            </Link>
            <Link to="/mypage">
              <MypageButton>마이페이지</MypageButton>
            </Link>{' '}
          </div>
        ) : AuthStore.getUserRole() === 'mentor' ? (
          <div>
            <Link to="/suggestion">
              <SuggestionButton>건의사항</SuggestionButton>
            </Link>
            <Link to="/mentors/mentorings/">
              <MyMentoringButton>나의 멘토링</MyMentoringButton>
            </Link>
            <Link to="/mentor-detail">
              <MypageButton>마이페이지</MypageButton>
            </Link>{' '}
          </div>
        ) : (
          <div>
            <Link to="/suggestion">
              <SuggestionButton>건의사항</SuggestionButton>
            </Link>
            <Link to="/mypage">
              <DataRoomButton>데이터룸</DataRoomButton>
            </Link>{' '}
          </div>
        )}
      </div>
    </HeaderStyle>
  );
};

export default Header;
