import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import useImg from '../../assets/image/mainpageImg/img2.png';
import noticeImg from '../../assets/image/mainpageImg/img3.png';
import {
  MainBlueBody,
  NoticeTextStyle,
  TextStyle,
  TextUnder,
} from './mainPageStyled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import theme from '../../styles/theme';

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 6000,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0px',
};

const Container = styled.span<{
  w: number;
  h: number;
}>`
  box-sizing: border-box;
  border-radius: 10%;
  height: ${props => props.h + 'rem'};
  width: ${props => props.w + 'rem'};
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    width: '60rem';
    margin: 0 auto;
  }
`;

const CardBox = styled.div`
  cursor: pointer;
  position: relative;
`;

const CardImg = styled.img<{
  w: number;
  h: number;
}>`
  width: ${props => props.w + 'rem'};
  height: ${props => props.h + 'rem'};
  box-sizing: border-box;
  border-radius: 10%;
  z-index: 1;
`;

const IineHeight = styled.div`
  line-height: 2.5rem;
`;

interface sliderStlye {
  w: number;
  h: number;
  isMobile: boolean;
}

const TitleStyle = styled.span`
  ${theme.fontWeight.weightLarge};
  font-size: 2rem;
`;

export const CadetText = (
  <TextStyle>
    <TitleStyle>
      {'< '} Cadet {' >'}
    </TitleStyle>
    <br />
    1. メンタリング<MainBlueBody>申請ボタン</MainBlueBody>をクリック
    <br />
    2. 面会<MainBlueBody>日程</MainBlueBody>と<MainBlueBody>情報</MainBlueBody>
    を記入して提出
    <br />
    3. <MainBlueBody>マイページ</MainBlueBody>で面会の状態を確認可能
    <br />
    4. 確定、キャンセルされると、カデットに
    <MainBlueBody>通知メール送信</MainBlueBody>
    <br />
    5. Slackを通じて<MainBlueBody>場所を協議後</MainBlueBody>
    、面会予定時間にメンタリングを実施
  </TextStyle>
);

export const MentorText = (
  <TextStyle>
    <TitleStyle>
      {'< '} Mentor {' >'}
    </TitleStyle>
    <br />
    1. カデットのメンタリング申請時に<MainBlueBody>通知メール送信</MainBlueBody>
    <br />
    2. <MainBlueBody>マイページ</MainBlueBody>で面会の状態を決定可能
    <br />
    3. 確定またはキャンセルされると、カデットに通知メールが送信
    <br />
    4. Slackを通じて<MainBlueBody>場所を協議後</MainBlueBody>
    、面会予定時間に実施
    <br />
    5. メンタリング終了後に<MainBlueBody>報告書作成</MainBlueBody>が可能
  </TextStyle>
);

const MoTextStyle = styled.div`
  ${theme.font.inter};
  font-size: 1rem;
  line-height: 3.5rem;
  position: absolute;
  margin: 0 auto;
  margin-left: 2.5rem;
  width: 85%;
  top: 24%;
  z-index: 3;
`;

const MoTitleStyle = styled.span`
  ${theme.fontWeight.weightLarge};
  font-size: 1.4rem;
`;

export const MoCadetText = (
  <MoTextStyle>
    <MoTitleStyle>
      {'< '} Cadet {' >'}
    </MoTitleStyle>
    <br />
    1. メンタリング<MainBlueBody>申請ボタン</MainBlueBody>をクリック
    <br />
    2. 面会<MainBlueBody>日程</MainBlueBody>と<MainBlueBody>情報</MainBlueBody>
    を記入して提出
    <br />
    3. <MainBlueBody>マイページ</MainBlueBody>で面会の状態を確認可能
    <br />
    4. 確定、キャンセルされると、カデットに
    <MainBlueBody>通知メール送信</MainBlueBody>
    <br />
    5. Slackを通じて<MainBlueBody>場所を協議後</MainBlueBody>
    、面会予定時間にメンタリングを実施
  </MoTextStyle>
);

export const MoMentorText = (
  <MoTextStyle>
    <MoTitleStyle>
      {'< '} Mentor {' >'}
    </MoTitleStyle>
    <br />
    1. カデットのメンタリング申請時に<MainBlueBody>通知メール送信</MainBlueBody>
    <br />
    2. <MainBlueBody>マイページ</MainBlueBody>で面会の状態を決定可能
    <br />
    3. 確定またはキャンセルされると、カデットに通知メールが送信
    <br />
    4. Slackを通じて<MainBlueBody>場所を協議後</MainBlueBody>
    、面会予定時間に実施
    <br />
    5. メンタリング終了後に<MainBlueBody>報告書作成</MainBlueBody>が可能
  </MoTextStyle>
);

export const NoticeText = (
  <NoticeTextStyle>
    <br />
    <IineHeight>
      1. メンタリングを申請した後、<MainBlueBody>48時間以内</MainBlueBody>
      にメンターが承諾しない場合は自動キャンセルされます
    </IineHeight>
    <br />
    <IineHeight>
      2. メンタリングの承諾はカデットが選んだ最も遅い希望時間の
      <MainBlueBody>10分前</MainBlueBody>まで可能です。それ以降は
      <MainBlueBody>自動キャンセル</MainBlueBody>されます
    </IineHeight>
    <br />
    <IineHeight>
      3. <MainBlueBody>メンター</MainBlueBody>の場合、マイページで
      <MainBlueBody>メンターキーワードを1つ以上</MainBlueBody>
      選択してください！キーワードがないと表示されません
    </IineHeight>
  </NoticeTextStyle>
);

const MoNoticeTextStyle = styled.div`
  ${theme.font.inter};
  font-size: 1.2rem;
  line-height: 1rem;
  position: absolute;
  margin: 0 auto;
  margin-left: 6%;
  width: 85%;
  top: 24%;
  z-index: 3;
`;

export const MoNoticeText = (
  <MoNoticeTextStyle>
    <br />
    <IineHeight>
      1. メンタリングを申請した後、<MainBlueBody>48時間以内</MainBlueBody>
      にメンターが承諾しない場合は自動キャンセルされます
    </IineHeight>
    <br />
    <IineHeight>
      2. メンタリングの承諾はカデットが選んだ最も遅い希望時間の
      <MainBlueBody>10分前</MainBlueBody>まで可能です。それ以降は
      <MainBlueBody>自動キャンセル</MainBlueBody>されます
    </IineHeight>
    <br />
    <IineHeight>
      3. <MainBlueBody>メンター</MainBlueBody>の場合、マイページで
      <MainBlueBody>メンターキーワードを1つ以上</MainBlueBody>
      選択してください！キーワードがないと表示されません
    </IineHeight>
  </MoNoticeTextStyle>
);

function ImageSlider(props: sliderStlye) {
  const sliders = [NoticeText, CadetText, MentorText];
  const moSliders = [MoNoticeText, MoCadetText, MoMentorText];
  return (
    <Container w={props.w} h={props.h}>
      <StyledSlider {...settings}>
        {!props.isMobile
          ? sliders.map((text, index: number) => {
              return (
                <div key={index}>
                  <CardBox>
                    {index >= 1 ? (
                      <CardImg src={useImg} w={props.w} h={props.h}></CardImg>
                    ) : (
                      <CardImg
                        src={noticeImg}
                        w={props.w}
                        h={props.h}
                      ></CardImg>
                    )}
                    {text}
                  </CardBox>
                </div>
              );
            })
          : moSliders.map((text, index: number) => {
              return (
                <div key={index}>
                  <CardBox>
                    {index >= 1 ? (
                      <CardImg src={useImg} w={props.w} h={props.h}></CardImg>
                    ) : (
                      <CardImg
                        src={noticeImg}
                        w={props.w}
                        h={props.h}
                      ></CardImg>
                    )}
                    {text}
                  </CardBox>
                </div>
              );
            })}
      </StyledSlider>
    </Container>
  );
}
export default ImageSlider;
