import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import styled from 'styled-components';
import {
  axiosWithNoData,
  AXIOS_METHOD_WITH_NO_DATA,
} from '../../context/axios-interface';
import theme from '../../styles/theme';
import { reportsPro } from './getreportdata';
import ino1 from '../../assets/image/logo/ino1.png';
import {
  PlaceBox,
  SubTitle2,
  NoneValue2,
  Title,
  ReportContainer,
  SubTitle6,
  Titleplus,
  NoneValue1,
  SubTitle1,
  SubTitle3,
  SubTitle4,
  SubTitle5,
  SubTitle7,
  SubTitle8,
  MiniTitle1,
  MiniTitle2,
  DateBox,
  TimeBox,
  MentorNameBox,
  ContentTitle1,
  ContentTitle2,
  ContentTitle3,
  ContentBody1,
  ContentBody2,
  ContentBody3,
  ContentBody4,
  ContentBody5,
  ContentBody6,
  IsCommonBox,
  NotCommonBox,
  ImgLogo1,
  ImgLogo3,
  MentoSign,
  SignText,
  PlaceBox2,
  Cadet,
} from './reportStyled';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from '@mui/material';
import LoadingStore from '../../states/loading/LoadingStore';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import { NewDateKr } from '../../states/date-kr';

const ReportpageStyle = styled.div`
  background-color: ${theme.colors.backgoundWhite};
  margin-left: 40rem;
  width: 100%;
  height: 300rem;
  margin-left: 0;
  display: flex;
  top: 0;
  justify-content: center;
`;

const imagestyle2 = {
  height: '3.6rem',
  width: '11rem',
};

const signimagestyle = {
  width: '3.8rem',
  height: '3.8rem',
};

const ImgBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 5rem;
`;
const ButtonBody = styled.div`
  display: flex;
  z-index: 5;
`;

const PrintButton = styled.button`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  margin-top: 1rem;
  z-index: 1;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.polarSimpleMain};
  color: white;
  border: none;
  border-radius: 10px;
  width: 15rem;
  height: 5rem;
  box-shadow: ${theme.shadow.buttonShadow};
`;

const ModifyButton = styled(PrintButton)`
  margin-right: 3rem;
`;

const PlaceBoxStyled = styled.div<{ len: number }>`
  ${props => (props.len > 200 ? 'font-size: 1rem' : 'font-size: 1.6rem')};
`;

const SimpleComponent = (props: {
  printRef: any;
  reportDatas: reportsPro[];
}) => {
  const { printRef, reportDatas } = props;

  return (
    <div ref={printRef}>
      {reportDatas?.map((reportdata: reportsPro, index: number, origin) => {
        const meetingAt = [
          NewDateKr(reportdata?.mentoringLogs.meetingAt[0]),
          NewDateKr(reportdata?.mentoringLogs.meetingAt[1]),
        ];
        return (
          <div key={index}>
            {index !== 0 ? (
              <>
                <table style={{ pageBreakAfter: 'always' }}>
                  <tbody></tbody>
                </table>
                <table style={{ pageBreakAfter: 'always' }}>
                  <tbody></tbody>
                </table>
              </>
            ) : null}
            <ReportContainer>
              <Title>
                <Titleplus>42 SEOUL</Titleplus> メンタリング 報告書(メンター用)
              </Title>
              <NoneValue1></NoneValue1>
              <SubTitle1>区分</SubTitle1>
              <MiniTitle1>共通過程</MiniTitle1>
              <MiniTitle2>深化過程</MiniTitle2>
              <NoneValue2></NoneValue2>
              <SubTitle2>日付</SubTitle2>
              <DateBox>
                {reportdata?.mentoringLogs
                  ? meetingAt[0].toLocaleDateString('ko-KR')
                  : ''}
              </DateBox>
              <SubTitle8>時刻</SubTitle8>
              <TimeBox>
                {reportdata?.mentoringLogs
                  ? meetingAt[0].getHours().toString().padStart(2, '0') +
                    ':' +
                    meetingAt[0].getMinutes().toString().padStart(2, '0') +
                    '~' +
                    meetingAt[1].getHours().toString().padStart(2, '0') +
                    ':' +
                    meetingAt[1].getMinutes().toString().padStart(2, '0')
                  : ''}
              </TimeBox>
              <SubTitle3>場所</SubTitle3>
              <PlaceBox>{reportdata?.place}</PlaceBox>
              <SubTitle4>メンター</SubTitle4>
              <MentorNameBox>
                {reportdata?.mentors.name}
                <SignText>(印)</SignText>
                <MentoSign>
                  <img
                    src={reportdata?.signatureUrl}
                    style={signimagestyle}
                    alt=""
                  />
                </MentoSign>
              </MentorNameBox>
              <Cadet>メンティ</Cadet>
              <PlaceBox2>
                <PlaceBoxStyled len={reportdata?.extraCadets.length}>
                  {reportdata?.cadets.name +
                    '(' +
                    reportdata?.cadets.intraId +
                    ')' +
                    ', ' +
                    reportdata?.extraCadets}
                </PlaceBoxStyled>
              </PlaceBox2>
              <SubTitle5>メンタリング概要</SubTitle5>
              <ContentTitle1>テーマ</ContentTitle1>
              <ContentBody1
                len={reportdata?.topic.length}
                readOnly
                value={reportdata?.topic}
              ></ContentBody1>
              <ContentTitle2>内容</ContentTitle2>
              <ContentBody2
                len={reportdata?.content.length}
                readOnly
                value={reportdata?.content}
              ></ContentBody2>
              <ContentTitle3>
                生徒
                <br />
                に
                <br /> 伝えたいこと
              </ContentTitle3>
              <ContentBody3
                len={reportdata?.feedbackMessage.length}
                readOnly
                value={reportdata?.feedbackMessage}
              ></ContentBody3>
              <SubTitle6>証明写真</SubTitle6>
              <ContentBody4>
                {reportdata?.imageUrl[0] ? (
                  <img
                    src={reportdata?.imageUrl[0]}
                    style={{
                      height: 'auto',
                      maxWidth: '30rem',
                      maxHeight: '32rem',
                      minWidth: '20rem',
                    }}
                    alt=""
                  />
                ) : (
                  ''
                )}
                {reportdata?.imageUrl[1] ? (
                  <img
                    src={reportdata?.imageUrl[1]}
                    style={{
                      height: 'auto',
                      maxWidth: '30rem',
                      maxHeight: '32rem',
                      minWidth: '20rem',
                    }}
                    alt=""
                  />
                ) : (
                  ''
                )}
              </ContentBody4>
              <SubTitle7>メンタリングのフィードバック</SubTitle7>
              <ContentBody5>
                フィードバック (最高 5点, 最低 1点)
                <br />
                1. 生徒が質問をよく整理して持ってきたか？ (
                {reportdata?.feedback1})
                <br />
                2. 生徒との時間は満足のいくものだったか？ (
                {reportdata?.feedback2})
                <br />
                3. 生徒が伝えた内容をよく理解したか？ ({reportdata?.feedback3})
                <br />
              </ContentBody5>
              <ContentBody6>(財)イノベーションアカデミー 御中</ContentBody6>
              {reportdata?.cadets.isCommon ? (
                <IsCommonBox> o </IsCommonBox>
              ) : (
                <IsCommonBox> </IsCommonBox>
              )}
              {reportdata?.cadets.isCommon ? (
                <NotCommonBox> </NotCommonBox>
              ) : (
                <NotCommonBox> o </NotCommonBox>
              )}
              <ImgLogo1>
                <img
                  src={ino1}
                  style={imagestyle2}
                  className="report-image"
                  alt=""
                />
              </ImgLogo1>
              <ImgLogo3>
                <img
                  src={ino1}
                  style={imagestyle2}
                  className="report-image"
                  alt=""
                />
              </ImgLogo3>
            </ReportContainer>
          </div>
        );
      })}
    </div>
  );
};

const ReportDetail = () => {
  const [reportQuery] = useSearchParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [reportDatas, setreportDatas] = useState<reportsPro[]>([]);
  const reportIds = reportQuery.getAll('reportId');
  const isAutoPrint = reportQuery.get('autoPrint') === 'true' ? true : false;
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = debounce(() => {
    if (window.innerWidth < 1667) setIsMobile(true);
    else setIsMobile(false);
  }, 10);

  const getReports = async (reportId: string) => {
    try {
      const datas = reportDatas;
      const response = await axiosWithNoData(
        AXIOS_METHOD_WITH_NO_DATA.GET,
        `/reports/${reportId}`,
        {
          headers: {
            Authorization: `bearer ${AuthStore.getAccessToken()}`,
          },
        },
      );
      datas.push(response.data);
      setreportDatas([...datas]);
    } catch (e) {
      ErrorStore.on('無効なデータです。', ERROR_DEFAULT_VALUE.TITLE);
    }
  };

  async function getAllReportData() {
    LoadingStore.on();
    await Promise.all(reportIds.map(id => getReports(id)));
    if (isAutoPrint) {
      buttonRef?.current?.click();
    }
    LoadingStore.off();
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    getAllReportData();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!AuthStore.getAccessToken()) {
    ErrorStore.on('ログインが必要なサービスです。', ERROR_DEFAULT_VALUE.TITLE);
    AuthStore.Login();
    return <></>;
  } else if (AuthStore.getUserRole() !== USER_ROLES.BOCAL) {
    ErrorStore.on('アクセス権限がありません。', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else
    return (
      <>
        <ReportpageStyle>
          <ButtonBody>
            {reportIds.length === 1 ? (
              <Link
                to={`../mentorings/reports/${reportIds[0]}`}
                state={{ modify: true }}
              >
                <ModifyButton>報告書の修正</ModifyButton>
              </Link>
            ) : null}
          </ButtonBody>
          <ImgBody>
            <SimpleComponent
              printRef={componentRef}
              reportDatas={reportDatas}
            />
          </ImgBody>
          <ReactToPrint
            content={() => componentRef.current}
            trigger={() => (
              <ButtonBody>
                <PrintButton ref={buttonRef}>出力</PrintButton>
              </ButtonBody>
            )}
            onAfterPrint={() => {
              if (isAutoPrint) {
                navigate('/data-room');
              }
            }}
          />
        </ReportpageStyle>
      </>
    );
};

export default ReportDetail;
