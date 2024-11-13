import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import defaultTheme from '../../styles/theme';

const Background = styled.div`
  display: flex;
  width: 100%;
  height: 2000px;
`;

const NotFound = () => {
  const navi = useNavigate();
  return (
    <Background>
      <OneButtonModal
        TitleText="❌ 不正なページリクエスト"
        Text="SOMETHING WENT WRONG (404)"
        ButtonText="戻る"
        ButtonBg={`${defaultTheme.colors.Red}`}
        ButtonFunc={() => {
          navi(-1);
        }}
      />
    </Background>
  );
};

export default NotFound;
