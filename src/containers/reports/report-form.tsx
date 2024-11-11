import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import { Title } from './title';
import { ReportElement } from './elements/report-element';
import { ReportRowFeedback } from './report-row-feedback';
import { ReportRowSignature } from './report-row-signature';
import { ReportFixableElement } from './elements/report-fixable-element';
import { useEffect, useState } from 'react';
import defaultTheme from '../../styles/theme';
import { useLocation, useParams } from 'react-router-dom';
import ReportStore from '../../states/repoort/ReportStore';
import { observer } from 'mobx-react-lite';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import { ReportRowWrite } from './report-row-write';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import { isValidTime } from '../my-mentoring-mentor/modal/wait/select-time';
import { NewDateKr } from '../../states/date-kr';
import { ReportFixableElementWithoutTopic } from './elements/report-fixable-element-without-topic';
import { ReportFixableWithModal } from './elements/report-fixable-with-modal';
import { TimePickerModal } from './elements/report-time-picker/time-picker-modal';

export const REPORT_STATE = {
  EDIT_POSSIBLE: '作成中',
  EDIT_IMPOSSIBLE: '作成完了',
  EDIT_ONLYONE: '修正期間',
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
  padding-bottom: 3rem;
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

const DefaultButton = styled.button`
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
  box-shadow: ${defaultTheme.shadow.buttonShadow};
`;

const ModifyButton = styled(DefaultButton)`
  //box-shadow: ${defaultTheme.shadow.buttonShadow};
`;

export const START_TIME = 0;
export const END_TIME = 1;

/**
 * 0以上10未満の数字を2桁の数にする
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
 * Date変数を文字列に変換する
 * Date形式でない変数の場合は "-" を返す
 * @param meetingAt :Date
 * @returns "2022.08.19 (火)"
 */
export const getDayToString = (meetingAt: Date): string => {
  if (!meetingAt) {
    return '-';
  }
  const date: string[] = ['日', '月', '火', '水', '木', '金', '土'];
  const startTime: Date = meetingAt;
  if (!isValidTime(startTime)) {
    return '-';
  }

  return `${startTime.getFullYear()}.${
    startTime.getMonth() + 1
  }.${startTime.getDate()} (${date[startTime.getDay()]})`;
};

/**
 * Date[2] 配列の時刻の間隔を返す
 * - Date 型ではなければ、からの文字列を返す
 * @param meetingAt :Date
 * @returns "14:00 ~ 15:00"
 */
export const getTimeToString = (meetingAt: Date[]): string => {
  if (!meetingAt) {
    return '';
  }
  const startTime: Date = meetingAt[START_TIME];
  const endTime: Date = meetingAt[END_TIME];
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return '';
  }

  return `${startTime.getHours()}:${makeTimePair(
    startTime.getMinutes(),
  )} ~ ${endTime.getHours()}:${makeTimePair(endTime.getMinutes())}`;
};

const ReportElementCadet = styled.div`
  grid-column-start: 3;
  grid-column-end: 5;
`;

function IsEidt(isModify: boolean) {
  return (
    ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE ||
    ReportStore.report.status === REPORT_STATE.EDIT_ONLYONE ||
    isModify === true
  );
}

const ReportForm = observer(() => {
  const { reportId } = useParams<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [extraCadet, setExtraCadet] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedback1, setFeedback1] = useState<number>(5);
  const [feedback2, setFeedback2] = useState<number>(5);
  const [feedback3, setFeedback3] = useState<number>(5);
  const [place, setPlace] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  const [timePicker, setTimePicker] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const locate = useLocation();
  const [isModify, setIsModify] = useState<boolean>(
    locate.state !== null ? true : false,
  );

  useEffect(() => {
    async function Initialize() {
      if (!reportId) {
        return;
      }
      await ReportStore.Initializer(reportId, AuthStore.getAccessToken());
      ReportStore?.report?.topic && setTopic(ReportStore?.report?.topic);

      ReportStore?.report?.content && setContent(ReportStore.report.content);

      ReportStore?.report?.feedbackMessage &&
        setFeedbackMessage(ReportStore.report.feedbackMessage);

      ReportStore?.report?.feedback1 &&
        setFeedback1(ReportStore?.report?.feedback1);

      ReportStore?.report?.feedback2 &&
        setFeedback2(ReportStore?.report?.feedback2);

      ReportStore?.report?.feedback3 &&
        setFeedback3(ReportStore?.report?.feedback3);

      ReportStore?.report?.extraCadets &&
        setExtraCadet(ReportStore?.report?.extraCadets);

      setPlace(ReportStore?.report?.place);

      setStartTime(ReportStore?.report?.mentoringLogs?.meetingAt?.[START_TIME]);

      setEndTime(ReportStore?.report?.mentoringLogs?.meetingAt?.[END_TIME]);

      setIsLoaded(true);
    }
    Initialize();
  }, []);

  function setReportRequestDto() {
    ReportStore.setExtraCadet(extraCadet);
    ReportStore.setPlace(place);
    ReportStore.setTopic(topic);
    ReportStore.setContent(content);
    ReportStore.setFeedback1(feedback1);
    ReportStore.setFeedback2(feedback2);
    ReportStore.setFeedback3(feedback3);
    ReportStore.setFeedbackMessage(feedbackMessage);
    ReportStore.setTime([startTime, endTime]);
  }

  return (
    <NoneDrag>
      {modal && (
        <OneButtonModal
          TitleText="📝 レーポットの提出の確認"
          Text={`本当に提出しますか？\n提出後には修正ができません。`}
          XButtonFunc={() => {
            setModal(false);
          }}
          ButtonText="確認"
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
      {timePicker && (
        <TimePickerModal
          XButtonFunc={() => {
            setTimePicker(false);
          }}
          setStartDateTime={setStartTime}
          setEndDateTime={setEndTime}
        />
      )}
      {isLoaded && (
        <Container component="main" maxWidth="lg" fixed={true}>
          <Title title={'報告書 作成'} />
          <ReportContainer>
            <ReportInfoContainer>
              <ReportElement
                topic={'区分'}
                content={
                  ReportStore.report.cadets.isCommon ? '共通過程' : '深化過程'
                }
              />
              <ReportElement
                topic={'日付'}
                content={getDayToString(NewDateKr(startTime))}
              />
              <ReportFixableWithModal
                topic={'時間'}
                content={getTimeToString([
                  NewDateKr(startTime),
                  NewDateKr(endTime),
                ])}
                isEditPossible={IsEidt(isModify)}
                modalSetter={setTimePicker}
              />
              <ReportFixableElement
                topic={'場所'}
                content={place}
                contentSetter={setPlace}
                isEditPossible={IsEidt(isModify)}
                maxLength={50}
              />
              <ReportElement
                topic={'メンター'}
                content={ReportStore.report.mentors.name}
              />
              <ReportElement
                topic={'カデット'}
                content={
                  ReportStore.report.cadets.name +
                  '(' +
                  ReportStore.report.cadets.intraId +
                  ')'
                }
              />
              <ReportElementCadet>
                <ReportFixableElementWithoutTopic
                  content={extraCadet}
                  contentSetter={setExtraCadet}
                  isEditPossible={IsEidt(isModify)}
                  maxLength={500}
                />
              </ReportElementCadet>
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
              isEditPossible={IsEidt(isModify)}
            />
            <ReportRowFeedback
              feedback1={feedback1}
              setFeedback1={setFeedback1}
              feedback2={feedback2}
              setFeedback2={setFeedback2}
              feedback3={feedback3}
              setFeedback3={setFeedback3}
              isEditPossible={IsEidt(isModify)}
            />
          </ReportContainer>
          {IsEidt(isModify) && (
            <ButtonContainer>
              {ReportStore.report.status === REPORT_STATE.EDIT_POSSIBLE && (
                <DefaultButton
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
                  一時保存
                </DefaultButton>
              )}
              <DefaultButton
                onClick={() => {
                  setModal(true);
                }}
              >
                提出
              </DefaultButton>
            </ButtonContainer>
          )}
        </Container>
      )}
    </NoneDrag>
  );
});

export default ReportForm;
