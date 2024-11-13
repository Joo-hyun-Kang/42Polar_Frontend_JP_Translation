import styled from '@emotion/styled';
import defaultTheme from '../styles/theme';
import spinner from '../assets/image/loading-spinner.gif';
import { useEffect } from 'react';

export const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(246, 246, 246, 0.3);

  z-index: 999;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const LoadingText = styled.div`
  ${defaultTheme.font.nanumGothic};
  ${defaultTheme.fontSize.sizeExtraSmall};
  text-align: center;
`;

const text: string[] = [
  '星を集めています',
  '星と連絡を取り合っています',
  '星の守り手がリクエストを遂行中です',
  '新しい惑星を探しています',
  '宇宙船と連絡を取っています',
  'ポーラー艦船と接続中です',
  '新人航海士が運転しています',
  '熟練した航海士が運転しています',
  '楽しい旅を計画中です',
  '北極星の座標を見つけました',
  '目標に向かって前進しています',
];

function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function Loading() {
  useEffect(() => {
    document.body.style.overflow = `hidden`;
    return () => {
      document.body.style.overflow = `auto`;
    };
  }, []);

  return (
    <Background>
      <img src={spinner} alt="ローディング中" width="5%" />
      <LoadingText>{`${
        text[getRandomNumber(0, text.length)]
      }. 少々お待ちください`}</LoadingText>
    </Background>
  );
}
