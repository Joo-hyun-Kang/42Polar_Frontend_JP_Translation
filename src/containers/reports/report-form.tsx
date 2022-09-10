import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import { Title } from './title';
import { ReportElement } from './elements/report-element';
import { ReportRowFeedback } from './report-row-feedback';
import { ReportRowSignature } from './report-row-signature';
import { ReportFixableElement } from './elements/report-fixable-element';
import { useEffect, useState } from 'react';
import defaultTheme from '../../styles/theme';
import { useParams } from 'react-router-dom';
import ReportStore from '../../states/repoort/ReportStore';
import { observer } from 'mobx-react-lite';
import AuthStore from '../../states/auth/AuthStore';
import { ReportRowWrite } from './report-row-write';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import { isValidTime } from '../my-mentoring-mentor/modal/wait/select-time';

export const REPORT_STATE = {
  EDIT_POSSIBLE: '작성중',
  EDIT_IMPOSSIBLE: '작성완료',
};

const NoneDrag = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: ${defaultTheme.colors.polarGray};
`;

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px;
  padding: 0px 10px 10px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;

const ReportInfoContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const DefualtButton = styled.button`
  ${defaultTheme.fontSize.sizeExtraSmall};
  ${defaultTheme.font.nanumGothic};
  border-radius: 30px;
  border: none;
  text-align: center;
  text-decoration: none;
  background-color: #313c7a;
  color: #ffffff;
  padding: 10px 15px;
  margin: 10px;
  &:hover {
    opacity: 0.8;
  }
  cursor: pointer;
`;

export const START_TIME = 0;
export const END_TIME = 1;

/**
 * 0 이상 10 미만의 숫자를 2자리 수로 만듦
 * @param time Any number
 * @returns 00, 01, 02... 09
 */
export const makeTimePair = (time: number) => {
  if (time >= 0 && time < 10) {
    const ret = time.toString();
    return ret.padStart(2, '0');
  }
  return time.toString();
};

/**
 * Date 변수를 스트링으로 변환
 * - Date 형식이 아닌 변수는 - 리턴
 * @param meetingAt :Date
 * @returns "2022.08.19 (화)"
 */
export const getDayToString = (meetingAt: Date): string => {
  if (!meetingAt) {
    return '-';
  }
  const date: string[] = ['월', '화', '수', '목', '금', '토', '일'];
  const startTime: Date = new Date(meetingAt);
  if (!isValidTime(startTime)) {
    return '-';
  }

  return `${startTime.getFullYear()}.${
    startTime.getMonth() + 1
  }.${startTime.getDate()} (${date[startTime.getDay()]})`;
};

/**
 * Date[2] 배열의 시간 간격을 리턴
 * - Date 형식이 아닌 변수는 빈 문자열 리턴
 * @param meetingAt :Date
 * @returns "14:00 ~ 15:00"
 */
export const getTimeToString = (meetingAt: Date[]): string => {
  if (!meetingAt) {
    return '';
  }
  const startTime: Date = new Date(meetingAt[START_TIME]);
  const endTime: Date = new Date(meetingAt[END_TIME]);
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return '';
  }

  return `${startTime.getHours()}:${makeTimePair(
    startTime.getMinutes(),
  )} ~ ${endTime.getHours()}:${makeTimePair(endTime.getMinutes())}`;
};

const ReportForm = observer(() => {
  const { reportId } = useParams<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedback1, setFeedback1] = useState<number>(5);
  const [feedback2, setFeedback2] = useState<number>(5);
  const [feedback3, setFeedback3] = useState<number>(5);
  const [place, setPlace] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    async function Initialize() {
      if (!reportId) {
        return;
      }
      await ReportStore.Initializer(reportId, AuthStore.getAccessToken());
      setTopic(ReportStore?.report?.topic);
      setContent(ReportStore?.report?.content);
      setFeedbackMessage(ReportStore?.report?.feedbackMessage);
      setFeedback1(ReportStore?.report?.feedback1);
      setFeedback2(ReportStore?.report?.feedback2);
      setFeedback3(ReportStore?.report?.feedback3);
      setPlace(ReportStore?.report?.place);
      setIsLoaded(true);
    }
    Initialize();
  }, []);

  function setReportRequestDto() {
    ReportStore.setPlace(place);
    ReportStore.setTopic(topic);
    ReportStore.setContent(content);
    ReportStore.setFeedback1(feedback1);
    ReportStore.setFeedback2(feedback2);
    ReportStore.setFeedback3(feedback3);
    ReportStore.setFeedbackMessage(feedbackMessage);
  }

  return (
    <NoneDrag>
      {modal && (
        <OneButtonModal
          TitleText="📝 레포트 제출 확인"
          Text={`정말 제출하시겠습니까?\n제출 이후에는 레포트를 수정할 수 없습니다.`}
          XButtonFunc={() => {
            setModal(false);
          }}
          ButtonText="확인"
          ButtonBg={defaultTheme.colors.polarSimpleMain}
          ButtonFunc={() => {
            if (!reportId) {
              return;
            }
            setReportRequestDto();
            ReportStore.saveDone(reportId, AuthStore.getAccessToken());
            setModal(false);
          }}
        />
      )}
      {isLoaded && (
        <Container component="main" maxWidth="lg">
          <Title title={'보고서 작성'} />
          <ReportContainer>
            <ReportInfoContainer>
              <ReportElement
                topic={'구분'}
                content={
                  ReportStore.report.cadets.isCommon ? '공통과정' : '심화과정'
                }
              />
              <ReportElement
                topic={'날짜'}
                content={getDayToString(
                  ReportStore.report.mentoringLogs.meetingAt[START_TIME],
                )}
              />
              <ReportElement
                topic={'시간'}
                content={getTimeToString(
                  ReportStore.report.mentoringLogs.meetingAt,
                )}
              />
              <ReportFixableElement
                topic={'장소'}
                content={place}
                contentSetter={setPlace}
                isEditPossible={
                  ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE
                }
                maxLength={50}
              />
              <ReportElement
                topic={'멘토'}
                content={ReportStore.report.mentors.name}
              />
              <ReportElement
                topic={'카뎃'}
                content={ReportStore.report.cadets.name}
              />
            </ReportInfoContainer>
            <ReportRowSignature />
            <ReportRowWrite
              status={ReportStore.report.status}
              topic={topic}
              setTopic={setTopic}
              content={content}
              setContent={setContent}
              feedbackMessage={feedbackMessage}
              setFeedbackMessage={setFeedbackMessage}
              isEditPossible={
                ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE
              }
            />
            <ReportRowFeedback
              feedback1={feedback1}
              setFeedback1={setFeedback1}
              feedback2={feedback2}
              setFeedback2={setFeedback2}
              feedback3={feedback3}
              setFeedback3={setFeedback3}
              isEditPossible={
                ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE
              }
            />
          </ReportContainer>
          {ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE && (
            <ButtonContainer>
              <DefualtButton
                onClick={() => {
                  if (!reportId) {
                    return;
                  }
                  setReportRequestDto();
                  ReportStore.saveTemporary(
                    reportId,
                    AuthStore.getAccessToken(),
                  );
                }}
              >
                임시 저장
              </DefualtButton>
              <DefualtButton
                onClick={() => {
                  setModal(true);
                }}
              >
                제출
              </DefualtButton>
            </ButtonContainer>
          )}
        </Container>
      )}
    </NoneDrag>
  );
});

export default ReportForm;
