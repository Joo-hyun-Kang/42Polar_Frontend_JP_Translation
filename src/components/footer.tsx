import styled from 'styled-components';
import theme from '../styles/theme';

const FooterStyle = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  height: 12rem;
  font-size: 1.3rem;
  ${theme.font.inter};
  color: ${theme.colors.backgoundWhite};
`;
const FooterBody = styled.footer`
  text-align: center;
  ${theme.fontWeight.weightSmall};
`;
const FooterLastBody = styled.div`
  width: 100%;
  text-align: center;
  padding-bottom: 3rem;
`;
const FooterTextBody = styled.div`
  padding-top: 2.5rem;
`;
const FooterRightBody = styled.span`
  float: right;
  margin-right: 3%;
  cursor: pointer;
  display: inline-block;
`;
const FooterButtonOne = styled.span`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
const FooterButtonTwo = styled.span`
  margin-left: 2rem;
  background-color: transparent;
  border: none;
  color: ${theme.colors.backgoundWhite};
  cursor: pointer;
`;
const FooterLeftBody = styled.span`
  float: left;
  margin-left: 3%;
`;

const GithubButton = styled.span`
  cursor: pointer;
  float: center;
  margin-left: 1rem;
  align-items: center;
  align-content: center;
  background-color: transparent;
  color: ${theme.colors.backgoundWhite};
  border: none;
`;

const AtagTwo = styled.a`
  text-decoration: none;
  color: ${theme.colors.backgoundWhite};
`;

const Footer = () => {
  return (
    <FooterStyle>
      <div
        className="footerplus"
        style={{
          background: theme.colors.polarSimpleMain,
        }}
      >
        <FooterTextBody>
          <FooterLeftBody>42Polar by Cadets</FooterLeftBody>
          <GithubButton></GithubButton>
          <FooterRightBody>
            <FooterButtonOne>
              <AtagTwo href={process.env.REACT_APP_BASE_FORM_URL}>
                42Polarに関するお問い合わせ
              </AtagTwo>
            </FooterButtonOne>
            <FooterButtonTwo>
              <AtagTwo href={process.env.REACT_APP_BASE_FORM_URL}>
                メンタリング制度に関するお問い合わせ（運営陣）
              </AtagTwo>
            </FooterButtonTwo>
          </FooterRightBody>
        </FooterTextBody>
        <FooterBody>住所 東京都港区白金1丁目7-6</FooterBody>
        <FooterBody>copyright 2024 polar All rights reserved.</FooterBody>
        <FooterLastBody>
          Polarチームへのお問い合わせ : autoba9687@gmail.com
        </FooterLastBody>
      </div>
    </FooterStyle>
  );
};
export default Footer;
