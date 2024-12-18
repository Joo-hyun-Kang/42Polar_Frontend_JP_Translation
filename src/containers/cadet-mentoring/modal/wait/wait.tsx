import styled from '@emotion/styled';
import { InputCounter } from '../../../../components/input-counter';
import defaultTheme from '../../../../styles/theme';
import { ModalInfoElement } from '../../../my-mentoring-mentor/modal/modal-info-element';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0px;
`;

export interface WaitProps {
  content: string;
  mentoringTopic: string;
  requestTime: Date[][];
  mentor: {
    name: string;
    intraId: string;
  };
  rejectMessage: string;
  isReject: boolean;
  isRejectSetter: (p: boolean) => void;
  rejectReason: string;
  rejectReasonSetter: (input: string) => void;
  selectedTimeIndex: string;
  setSelectedTimeIndex: (s: string) => void;
}

const getDurationTime = (meetingAt: Date[]): string => {
  let hour = meetingAt[1].getHours() - meetingAt[0].getHours();
  let minute = meetingAt[1].getMinutes() - meetingAt[0].getMinutes();

  if (minute < 0) {
    minute *= -1;
    hour -= 1;
  }

  return `${hour}時間 ${minute.toString().padStart(2, '0')}分`;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day}`;
};

const getMeetingAt = (meetingAt: Date[]): string => {
  if (!meetingAt) {
    return '';
  }
  const hour = meetingAt[0].getHours().toString().padStart(2, '0');
  const minute = meetingAt[0].getMinutes().toString().padStart(2, '0');
  return `${formatDate(meetingAt[0])} ${hour}:${minute}  (${getDurationTime(
    meetingAt,
  )})`;
};

function formatRequestTimes(requestTime: Date[]): string {
  if (requestTime && requestTime.length) {
    return getMeetingAt(requestTime);
  }
  return '';
}

export function Wait(props: WaitProps) {
  return (
    <Container>
      {props.requestTime.map(time => {
        if (time && !isNaN(time[0].getDate())) {
          return (
            <ModalInfoElement
              title={'要請時刻'}
              titleColor={'black'}
              content={formatRequestTimes(time)}
            />
          );
        }
      })}
      <ModalInfoElement
        title={'メンター'}
        titleColor={'black'}
        content={props?.mentor?.name}
      />
      <ModalInfoElement
        title={'Intra ID'}
        titleColor={'black'}
        content={props?.mentor?.intraId}
        link={`${process.env.REACT_APP_ORIGIN}/mentor-detail/${props?.mentor?.intraId}`}
      />
      <ModalInfoElement
        title={'テーマ'}
        titleColor={'black'}
        content={props?.mentoringTopic}
      />
      <ModalInfoElement
        title={props.isReject ? '拒否理由' : '質問事項'}
        titleColor={defaultTheme?.colors?.polarSimpleMain}
        content={''}
      />
      {props.isReject ? (
        <InputCounter
          setter={props.rejectReasonSetter}
          value={props.rejectReason}
          maxLength={250}
          countDisabled={false}
          inputDisabled={false}
        />
      ) : (
        <InputCounter
          value={props.content}
          countDisabled={true}
          inputDisabled={true}
        />
      )}
    </Container>
  );
}
