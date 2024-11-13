import styled from 'styled-components';
import theme from '../../styles/theme';
import { useEffect, useState } from 'react';
import { Button, debounce } from '@mui/material';
import { InputCounter } from './apply-input-counter';
import axios, { AxiosError } from 'axios';
import { PostApply } from './apply-interface';
import {
  axiosInstance,
  axiosWithNoData,
  AXIOS_METHOD_WITH_NO_DATA,
} from '../../context/axios-interface';
import { Navigate, useParams } from 'react-router-dom';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import { defaultTheme } from 'react-select';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import { ApplyCalendarModal } from '../../components/apply-page/apply-calendar-modal';
import LoadingStore from '../../states/loading/LoadingStore';
import {
  faCalendarCheck,
  faCheck,
  faCircleExclamation,
  faClock,
  faHighlighter,
  faMessage,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import MentorDetailProps from '../../interface/mentor-detail/mentor-detail.interface';
import { NewDateKr, NowDateKr } from '../../states/date-kr';
import { MainBlueBody } from '../main-page/mainPageStyled';
import { light } from '@mui/material/styles/createPalette';

const Wrapper = styled.div`
  .modal {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: ${theme.colors.grayFour};
  }
  .modal button {
    outline: none;
    cursor: pointer;
    border: 0;
  }
  .modal > section {
    width: 90%;
    max-width: 960px;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: #fff;
    animation: modal-show 0.3s;
    overflow: hidden;
  }

  .modal > section > header {
    position: relative;
    padding: 16px 64px 16px 16px;
    background-color: #f1f1f1;
    font-weight: 700;
    ${theme.fontFrame.titleLarge};
  }
  .modal > section > header button {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    font-size: 21px;
    font-weight: 700;
    text-align: center;
    color: #999;
    background-color: transparent;
  }
  .modal > section > main {
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    border-top: 1px solid #dee2e6;
  }
  .modal > section > footer {
    padding: 12px 16px;
    text-align: right;
  }
  .modal > section > footer button {
    padding: 6px 12px;
    color: #fff;
    background-color: #6c757d;
    border-radius: 5px;
    font-size: 13px;
  }
  .modal.openModal {
    display: flex;
    align-items: center;
    /* 모달 애니메이션 */
    animation: modal-bg-show 0.3s;
  }
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ApplyContainer = styled.body`
  left: 0;
  ${theme.fontSize.sizeMedium};
  ${theme.font.inter};
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 20rem 63rem;
  grid-template-columns: 2% 47% 2% 47% 2%;
  transition: all 0.25s ease-in-out;
  grid-template-areas: 'time applyText';
  text-align: center;
  align-content: center;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${theme.colors.backgoundWhite};
  color: ${theme.colors.blackOne};
  z-index: 1;
`;

const MovApplyContainer = styled.div`
  left: 0;
  ${theme.fontSize.sizeMedium};
  ${theme.font.inter};
  height: calc(100% - 205px);
  width: 100%;
  display: grid;
  grid-template-rows: 20rem 60rem 60rem;
  grid-template-columns: 100%;
  transition: all 0.25s ease-in-out;
  grid-template-areas:
    'notice'
    'time '
    'applyText ';
  text-align: center;
  align-content: center;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${theme.colors.backgoundWhite};
  color: ${theme.colors.blackOne};
`;

const Notice = styled.div`
  background-color: ${theme.colors.polarBackground};
  box-sizing: border-box;
  border-bottom: 1px solid #bfbdbd;
  width: 100%;
  ${theme.fontSize.sizeSmall};
  text-align: center;
  align-items: center;
  grid-area: notice;
  grid-column-start: 1;
  grid-column-end: 6;
  grid-row-start: 1;
  grid-row-end: 1;
  margin-top: -3rem;
  z-index: 2;
`;
const NoticeTitle = styled.span`
  ${theme.fontWeight.weightLarge};
  ${theme.fontSize.sizeMedium};
  margin-bottom: 1rem;
`;

const NoticeHeight = styled.div`
  line-height: 1rem;
`;

const Chooseplan = styled.div`
  display: flex;
  flex-flow: row;
  flex-direction: column;
  text-align: center;
  flex-wrap: wrap;
  margin-top: -10rem;
  align-items: center;
  grid-area: time;
  grid-column-start: 2;
  grid-row-start: 2;
`;

const Content = styled.div`
  display: flex;
  flex-flow: row;
  text-align: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: -10rem;
  grid-column-start: 4;
  grid-row-start: 2;
`;

const Line = styled.div`
  display: flex;
  flex-flow: row;
  text-align: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: -5rem;
  grid-column-start: 3;
  grid-row-start: 2;
`;

const TextBold = styled.span`
  ${theme.fontWeight.weightLarge};
`;

const MovChooseplan = styled.div`
  display: flex;
  flex-flow: row;
  text-align: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  grid-area: time;
`;
const MovContent = styled.div`
  display: flex;
  flex-flow: row;
  text-align: center;
  align-items: center;
  flex-direction: column;
  grid-area: applyText;
`;

const PlanButton1 = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadow.buttonShadow};
  text-align: center;
  flex-wrap: wrap;
  ${theme.font.inter};
  font-size: 2rem;
  color: ${theme.fontColor.whiteColor};
  background-color: ${theme.colors.polarSimpleMain};
  margin-top: 4rem;
  border-radius: 20px;
  width: 100%;
  height: 8rem;
  cursor: pointer;
  border: none;
`;

const MovPlanButton1 = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadow.buttonShadow};
  text-align: center;
  flex-wrap: wrap;
  ${theme.font.inter};
  font-size: 2rem;
  color: ${theme.fontColor.whiteColor};
  background-color: ${theme.colors.polarSimpleMain};
  margin-top: 4rem;
  border-radius: 20px;
  width: 24rem;
  height: 8rem;
  cursor: pointer;
  border: none;
`;

const PlanButton2 = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  word-break: break-all;
  white-space: pre-wrap;
  box-shadow: ${theme.shadow.buttonShadow};
  ${theme.font.inter};
  font-size: 2rem;
  text-align: center;
  color: ${theme.fontColor.whiteColor};
  background-color: ${theme.colors.polarBrightMain};
  margin-top: 4rem;
  border-radius: 20px;
  width: 30rem;
  height: 8rem;
  cursor: pointer;
  border: none;
`;

const MovPlanButton2 = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${theme.shadow.buttonShadow};
  ${theme.font.inter};
  font-size: 2rem;
  text-align: center;
  color: ${theme.fontColor.whiteColor};
  background-color: ${theme.colors.polarBrightMain};
  margin-top: 4rem;
  border-radius: 20px;
  width: 24rem;
  height: 8rem;
  cursor: pointer;
  border: none;
`;

const BottomSize = styled.div`
  margin-bottom: 1.5rem;
`;

const Line1 = styled.div`
  text-align: center;
  align-items: center;
  border-top: 0.3rem solid #000000;
  width: 60rem;
`;

const HeiLine = styled.div`
  text-align: center;
  align-items: center;
  border-right: 0.1rem solid #bfbdbd;
  height: 93vh;
  z-index: 0;
`;

const MovLine1 = styled.div`
  text-align: center;
  align-items: center;
  border-top: 0.3rem solid #000000;
  width: 45rem;
  margin-left: 2%;
  margin-right: 2%;
`;

const Line2 = styled.div`
  text-align: center;
  align-items: center;
  border-top: 0.1rem solid #000000;
  width: 100%;
`;

const MovLine2 = styled.div`
  margin-top: 2rem;
  text-align: center;
  align-items: center;
  border-top: 0.1rem solid #000000;
  width: 45rem;
`;

const MainText = styled.span`
  box-sizing: border-box;
  border-bottom: 1px solid black;
  ${theme.font.inter};
  ${theme.fontWeight.weightLarge};
  ${theme.fontSize.sizeExtraMedium};
`;

const MainTextNoLine = styled.div`
  margin-top: 2rem;
  text-align: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  ${theme.font.inter};
  ${theme.fontWeight.weightLarge};
  ${theme.fontSize.sizeExtraMedium};
`;

const IconPadding = styled.span`
  display: inline-block;
  text-align: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const MainText2 = styled.span`
  box-sizing: border-box;
  border-bottom: 1px solid black;
  ${theme.fontWeight.weightLarge};
  text-align: center;
  ${theme.font.inter};
  ${theme.fontSize.sizeExtraMedium};
`;

const MiddleText = styled.div`
  margin-top: 4rem;
  ${theme.font.inter};
  color: ${theme.colors.grayTwo};
  ${theme.fontSize.sizeExtraSmall};
`;

const MiddleText2 = styled.div`
  ${theme.fontSize.sizeExtraSmall};
  font-weight: 400;
  color: ${theme.colors.grayTwo};
  margin-left: -46rem;
  margin-top: 4rem;
  margin-bottom: -2rem;
`;

const MovMiddleText2 = styled.div`
  ${theme.fontSize.sizeExtraSmall};
  font-weight: 400;
  color: ${theme.colors.grayTwo};
  text-align: left;
  margin-left: -33rem;
  margin-top: 4rem;
  margin-bottom: -2rem;
`;

const MiddleText3 = styled.div`
  ${theme.fontSize.sizeExtraSmall};
  font-weight: 400;
  color: ${theme.colors.grayTwo};
  margin-left: -43rem;
  margin-bottom: -2rem;
`;

const MovMiddleText3 = styled.div`
  ${theme.fontSize.sizeExtraSmall};
  font-weight: 400;
  color: ${theme.colors.grayTwo};
  margin-left: -30rem;
  margin-bottom: -2rem;
`;

const ApplyButton = styled.button`
  margin-top: 4rem;
  margin-bottom: 1rem;
  box-shadow: ${theme.shadow.buttonShadow};
  text-align: center;
  ${theme.fontSize.sizeExtraSmall};
  ${theme.font.inter};
  color: ${theme.fontColor.whiteColor};
  background-color: ${theme.colors.polarSimpleMain};
  border-radius: 20px;
  width: 9rem;
  height: 3.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
`;

const ApplyButtonDiv = styled.div`
  position: relative;
`;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const DateDiv = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  padding-left: 3rem;
  padding-right: 3rem;
  justify-content: space-between;
  ${theme.fontFrame.bodyMiddle};
`;

const HourDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fontSize.sizeExtraMedium};
`;

export type RequestErrorResponse = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: Date;
};

const ApplyPage = () => {
  const [modalOpen, setModalOpen] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const { mentorId } = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorModalMsg, setErrorModalMsg] = useState<string>('');
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [firstStartTime, setFirstStartTime] = useState<Date>();
  const [firstEndTime, setFirstEndTime] = useState<Date>();
  const [secondStartTime, setSecondStartTime] = useState<Date>();
  const [secondEndTime, setSecondEndTime] = useState<Date>();
  const [thirdStartTime, setThirdStartTime] = useState<Date>();
  const [thirdEndTime, setThirdEndTime] = useState<Date>();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<PostApply>({
    topic: topic,
    content: content,
    requestTime1: [NowDateKr(), NowDateKr()],
    requestTime2: null,
    requestTime3: null,
  });

  const handleResize = debounce(() => {
    if (window.innerWidth < 1070) setIsMobile(true);
    else setIsMobile(false);
  }, 10);

  const postApply = async () => {
    try {
      LoadingStore.on();
      await axiosInstance
        .post(`mentoring-logs/apply/${mentorId}`, postData, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
        .then(res => {
          if (res.status === 201) {
            setSuccessModal(true);
          } else {
            setErrorModalMsg('リクエストエラーが発生しました');
            setErrorModal(true);
          }
        });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorModalMsg(
          `${(err.response?.data as RequestErrorResponse).message}`,
        );
      } else {
        setErrorModalMsg('リクエストエラーが発生しました');
      }
      setErrorModal(true);
    } finally {
      LoadingStore.off();
    }
  };

  useEffect(() => {
    console.log('isLoading' + isLoading);
  }, [isLoading]);

  useEffect(() => {
    LoadingStore.on();
    setToken(AuthStore.getAccessToken());
    setRole(AuthStore.getUserRole());
    try {
      axiosWithNoData(AXIOS_METHOD_WITH_NO_DATA.GET, `mentors/${mentorId}`)
        .then(response => {
          if (response.status === 200) {
            setIsExist(true);
          }
          const { isActive }: MentorDetailProps = response.data;
          if (isActive === true) {
            setActive(true);
          }
        })
        .finally(() => {
          LoadingStore.off();
          setIsLoading(false);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ErrorStore.on(
          (error.response?.data as RequestErrorResponse).message,
          ERROR_DEFAULT_VALUE.TITLE,
        );
      } else {
        ErrorStore.on(
          'リクエストエラーが発生しました',
          ERROR_DEFAULT_VALUE.TITLE,
        );
      }
      navigate('/');
    }

    window.innerWidth <= 1070 ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (firstStartTime && firstEndTime) {
      postData.requestTime1 = [firstStartTime, firstEndTime];
    } else if (firstStartTime === undefined && firstEndTime === undefined) {
      if (secondStartTime && secondEndTime) {
        setFirstStartTime(NewDateKr(secondStartTime));
        setFirstEndTime(NewDateKr(secondEndTime));
        setSecondStartTime(undefined);
        setSecondEndTime(undefined);
      } else postData.requestTime1 = [];
    }
  }, [firstStartTime, firstEndTime]);

  useEffect(() => {
    if (secondStartTime && secondEndTime) {
      postData.requestTime2 = [secondStartTime, secondEndTime];
    } else if (secondStartTime === undefined && secondEndTime === undefined) {
      if (thirdStartTime && thirdEndTime) {
        setSecondStartTime(NewDateKr(thirdStartTime));
        setSecondEndTime(NewDateKr(thirdEndTime));
        setThirdStartTime(undefined);
        setThirdEndTime(undefined);
      } else postData.requestTime2 = null;
    }
  }, [secondStartTime, secondEndTime]);

  useEffect(() => {
    if (thirdStartTime && thirdEndTime) {
      postData.requestTime3 = [thirdStartTime, thirdEndTime];
    } else if (thirdStartTime === undefined && thirdEndTime === undefined)
      postData.requestTime3 = null;
  }, [thirdStartTime, thirdEndTime]);

  useEffect(() => {
    postData.content = content;
  }, [content]);

  useEffect(() => {
    postData.topic = topic;
  }, [topic]);

  function setRequestTime(props: { slot: number }) {
    let startTime: (date: Date) => void;
    let endTime: (date: Date) => void;
    let filledSlot = 0;

    if (firstStartTime !== undefined) {
      filledSlot += 1;
    }
    if (secondStartTime !== undefined) {
      filledSlot += 1;
    }
    if (thirdStartTime !== undefined) {
      filledSlot += 1;
    }

    if (props.slot > filledSlot + 1) {
      if (filledSlot === 0) {
        startTime = setFirstStartTime;
        endTime = setFirstEndTime;
      } else {
        startTime = setSecondStartTime;
        endTime = setSecondEndTime;
      }
    } else {
      if (props.slot === 1) {
        startTime = setFirstStartTime;
        endTime = setFirstEndTime;
      } else if (props.slot === 2) {
        startTime = setSecondStartTime;
        endTime = setSecondEndTime;
      } else {
        startTime = setThirdStartTime;
        endTime = setThirdEndTime;
      }
    }
    if (mentorId === undefined) return <></>;
    return (
      <ApplyCalendarModal
        XButtonFunc={() => {
          setModalOpen(0);
        }}
        mentorIntraId={mentorId}
        setStartDateTime={startTime}
        setEndDateTime={endTime}
      ></ApplyCalendarModal>
    );
  }

  const ClickEvent = () => {
    if (!(firstStartTime && firstEndTime)) {
      setErrorModalMsg('最初の申請時間は必ず入力する必要があります。');
    } else if (topic.length <= 0) {
      setErrorModalMsg('テーマを入力してください');
    } else if (content.length <= 0) {
      setErrorModalMsg('質問や疑問点を入力してください');
    } else {
      postApply();
      return;
    }
    setErrorModal(true);
  };

  if (isLoading) {
    return <></>;
  } else if (mentorId === undefined) {
    ErrorStore.on('不正なアクセスです。', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else if (isExist === false) {
    ErrorStore.on('存在しないメンターです', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else if (active === false) {
    ErrorStore.on(
      'メンタリングが利用できないメンターです',
      ERROR_DEFAULT_VALUE.TITLE,
    );
    return <Navigate to="/" />;
  } else if (!token) {
    ErrorStore.on('ログインが必要なサービスです', ERROR_DEFAULT_VALUE.TITLE);
    AuthStore.Login();
    return <></>;
  } else if (role !== USER_ROLES.CADET) {
    ErrorStore.on('アクセス権限がありません。', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else
    return (
      <div>
        {errorModal && (
          <OneButtonModal
            TitleText="⚠️ 42Polar 警告"
            Text={errorModalMsg}
            XButtonFunc={() => {
              setErrorModal(false);
            }}
            ButtonText="닫기"
            ButtonBg="gray"
            ButtonFunc={() => {
              setErrorModal(false);
            }}
          />
        )}
        {successModal && (
          <OneButtonModal
            TitleText="リクエスト かんりょ"
            Text="リクエストが正常に完了しました"
            XButtonFunc={() => {
              setSuccessModal(false);
              navigate('/cadets/mentorings');
            }}
            ButtonText="確認"
            ButtonFunc={() => {
              setSuccessModal(false);
              navigate('/cadets/mentorings');
            }}
          />
        )}
        {!isMobile ? (
          <div>
            <ApplyContainer>
              <Notice>
                <NoticeTitle>
                  <br />
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    size="1x"
                    color="black"
                  />{' '}
                  NOTICE
                </NoticeTitle>
                <NoticeHeight>
                  <br />
                </NoticeHeight>
                * 申請時間は<MainBlueBody>実際のメンタリング</MainBlueBody>
                を行う時間です。
                <br /> *申請時間にはメンターの
                <MainBlueBody>メンタリング可能時間</MainBlueBody>
                のみ表示されます。
                <br /> *予算に関係する時間ですので、申請ごとに
                <MainBlueBody>最大3時間まで</MainBlueBody>制限されています。
                <br /> *<MainBlueBody>追加時間</MainBlueBody>が必要な場合は
                <MainBlueBody>追加申請</MainBlueBody>をお願いいたします。
                <br /> <br />
              </Notice>
              <Chooseplan>
                <MainTextNoLine>
                  <MainText>日程を選択する</MainText>{' '}
                  <IconPadding>
                    <FontAwesomeIcon icon={faClock} size="2x" color="black" />{' '}
                  </IconPadding>
                </MainTextNoLine>
                <MiddleText>*最低1つの申請時間を選択してください</MiddleText>
                <Wrapper>
                  <ApplyButtonDiv>
                    <PlanButton1
                      onClick={() => {
                        setModalOpen(1);
                      }}
                    >
                      {firstStartTime && firstEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {firstStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {firstStartTime
                              .toTimeString()
                              .slice(
                                0,
                                firstStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              '~' +
                              firstEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  firstEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻1'
                      )}
                    </PlanButton1>
                    {firstStartTime && firstEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          color: 'white',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setFirstStartTime(undefined);
                          setFirstEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                  {modalOpen !== 0 && setRequestTime({ slot: modalOpen })}
                  <ApplyButtonDiv>
                    <PlanButton2
                      onClick={() => {
                        setModalOpen(2);
                      }}
                    >
                      {secondStartTime && secondEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {secondStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {secondStartTime
                              .toTimeString()
                              .slice(
                                0,
                                secondStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              ' ~ ' +
                              secondEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  secondEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻2'
                      )}
                    </PlanButton2>
                    {secondStartTime && secondEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setSecondStartTime(undefined);
                          setSecondEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                  <ApplyButtonDiv>
                    <PlanButton2
                      onClick={() => {
                        setModalOpen(3);
                      }}
                    >
                      {thirdStartTime && thirdEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {thirdStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {thirdStartTime
                              .toTimeString()
                              .slice(
                                0,
                                thirdStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              ' ~ ' +
                              thirdEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  thirdEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻3'
                      )}
                    </PlanButton2>
                    {thirdStartTime && thirdEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setThirdStartTime(undefined);
                          setThirdEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                  <BottomSize></BottomSize>
                </Wrapper>
              </Chooseplan>
              <Line>
                <HeiLine />
              </Line>
              <Content>
                <MainTextNoLine>
                  <MainText2>申請詳細</MainText2>{' '}
                  <FontAwesomeIcon
                    icon={faHighlighter}
                    size="sm"
                    color="black"
                  />{' '}
                </MainTextNoLine>
                <MiddleText2> · テーマ </MiddleText2>
                <InputCounter
                  setter={setTopic}
                  value={topic}
                  maxLength={150}
                  width="50rem"
                  disabled={false}
                  height="2.6rem"
                />
                <MiddleText3> · 質問事項 </MiddleText3>
                <InputCounter
                  setter={setContent}
                  value={content}
                  maxLength={500}
                  width="50rem"
                  disabled={false}
                  height="12rem"
                />
                <ApplyButton onClick={ClickEvent}>提出</ApplyButton>
              </Content>
            </ApplyContainer>
          </div>
        ) : (
          <div>
            <MovApplyContainer>
              <Notice>
                <NoticeTitle>
                  <br />
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    size="1x"
                    color="black"
                  />{' '}
                  NOTICE
                </NoticeTitle>
                <NoticeHeight>
                  <br />
                </NoticeHeight>
                * 申請時間は<MainBlueBody>実際のメンタリング</MainBlueBody>
                を行う時間です。
                <br /> *申請時間にはメンターの
                <MainBlueBody>メンタリング可能時間</MainBlueBody>
                のみ表示されます。
                <br /> *予算に関係する時間ですので、申請ごとに
                <MainBlueBody>最大3時間まで</MainBlueBody>制限されています。
                <br /> *<MainBlueBody>追加時間</MainBlueBody>が必要な場合は
                <MainBlueBody>追加申請</MainBlueBody>をお願いいたします。
                <br /> <br />
              </Notice>
              <MovChooseplan>
                <MainText>
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    size="1x"
                    color="black"
                  />{' '}
                  日程を選択する
                </MainText>
                <MiddleText>*最低1つの申請時間を選択してください</MiddleText>
                <Wrapper>
                  <ApplyButtonDiv>
                    <MovPlanButton1
                      onClick={() => {
                        setModalOpen(1);
                      }}
                    >
                      {firstStartTime && firstEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {firstStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {firstStartTime
                              .toTimeString()
                              .slice(
                                0,
                                firstStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              '~' +
                              firstEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  firstEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻1'
                      )}
                    </MovPlanButton1>
                    {firstStartTime && firstEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          color: 'white',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setFirstStartTime(undefined);
                          setFirstEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                  {modalOpen !== 0 && setRequestTime({ slot: modalOpen })}
                  <ApplyButtonDiv>
                    <MovPlanButton2
                      onClick={() => {
                        setModalOpen(2);
                      }}
                    >
                      {secondStartTime && secondEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {secondStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {secondStartTime
                              .toTimeString()
                              .slice(
                                0,
                                secondStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              ' ~ ' +
                              secondEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  secondEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻2'
                      )}
                    </MovPlanButton2>
                    {secondStartTime && secondEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setSecondStartTime(undefined);
                          setSecondEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                  <ApplyButtonDiv>
                    <MovPlanButton2
                      onClick={() => {
                        setModalOpen(3);
                      }}
                    >
                      {thirdStartTime && thirdEndTime ? (
                        <ButtonDiv>
                          <DateDiv>
                            {thirdStartTime.toLocaleDateString('ko-KR')}
                          </DateDiv>
                          <HourDiv>
                            {thirdStartTime
                              .toTimeString()
                              .slice(
                                0,
                                thirdStartTime.toTimeString().lastIndexOf(':'),
                              ) +
                              ' ~ ' +
                              thirdEndTime
                                .toTimeString()
                                .slice(
                                  0,
                                  thirdEndTime.toTimeString().lastIndexOf(':'),
                                )}
                          </HourDiv>
                        </ButtonDiv>
                      ) : (
                        '候補時刻3'
                      )}
                    </MovPlanButton2>
                    {thirdStartTime && thirdEndTime ? (
                      <FontAwesomeIcon
                        icon={faX}
                        size="sm"
                        style={{
                          opacity: 0.3,
                          cursor: 'pointer',
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                        }}
                        onClick={() => {
                          setThirdStartTime(undefined);
                          setThirdEndTime(undefined);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </ApplyButtonDiv>
                </Wrapper>
              </MovChooseplan>
              <MovContent>
                <MainText2>
                  <FontAwesomeIcon
                    icon={faHighlighter}
                    size="1x"
                    color="black"
                  />{' '}
                  申請詳細
                </MainText2>
                <MovMiddleText2> · テーマ </MovMiddleText2>
                <InputCounter
                  setter={setTopic}
                  value={topic}
                  maxLength={150}
                  width="37rem"
                  disabled={false}
                  height="4rem"
                />
                <MovMiddleText3> · 質問事項 </MovMiddleText3>
                <InputCounter
                  setter={setContent}
                  value={content}
                  maxLength={800}
                  width="37rem"
                  disabled={false}
                  height="20rem"
                />
                <ApplyButton onClick={ClickEvent}>提出</ApplyButton>
              </MovContent>
            </MovApplyContainer>
          </div>
        )}
      </div>
    );
};

export default ApplyPage;
