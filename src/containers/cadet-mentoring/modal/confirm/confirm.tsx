import styled from '@emotion/styled';
import { InputCounter } from '../../../../components/input-counter';
import defaultTheme from '../../../../styles/theme';
import { ModalInfoElement } from '../../../my-mentoring-mentor/modal/modal-info-element';
import { constTime } from './const-time';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0px;
`;

export interface ConfirmProps {
  content: string;
  mentoringTopic: string;
  meetingAt: Date[];
  mentor: {
    name: string;
    intraId: string;
  };
  rejectMessage: string;
  isReject: boolean;
  isRejectSetter: (p: boolean) => void;
  rejectReason: string;
  rejectReasonSetter: (input: string) => void;
  feedbackMessage: string | null;
}

export function Confirm(props: ConfirmProps) {
  return (
    <Container>
      {constTime(props?.meetingAt)}
      <ModalInfoElement
        title={'対象メンター'}
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
        titleColor={defaultTheme.colors.polarSimpleMain}
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
      {props.feedbackMessage && (
        <>
          <ModalInfoElement
            title={'メンターからのフィードバック'}
            titleColor={defaultTheme.colors.polarSimpleMain}
            content={''}
          />
          <InputCounter
            value={props.feedbackMessage}
            countDisabled={true}
            inputDisabled={true}
          />
        </>
      )}
      {props.rejectMessage && (
        <>
          <ModalInfoElement
            title={'拒否理由'}
            titleColor={defaultTheme.colors.polarSimpleMain}
            content={''}
          />
          <InputCounter
            value={props?.rejectMessage}
            countDisabled={true}
            inputDisabled={true}
          />
        </>
      )}
    </Container>
  );
}
