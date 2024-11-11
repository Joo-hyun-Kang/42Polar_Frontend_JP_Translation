import styled from '@emotion/styled';
import { InputCounter } from '../../../../components/input-counter';
import defaultTheme from '../../../../styles/theme';
import { ModalInfoElement } from '../modal-info-element';
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
  cadet: {
    name: string;
    intraId: string;
    isCommon: boolean;
    resumeUrl: string;
  };
  isReject: boolean;
  isRejectSetter: (p: boolean) => void;
  rejectReason: string;
  rejectReasonSetter: (input: string) => void;
}

export function Confirm(props: ConfirmProps) {
  return (
    <Container>
      {constTime(props?.meetingAt)}
      <ModalInfoElement
        title={'区分'}
        titleColor={'black'}
        content={props?.cadet?.isCommon ? '共通過程' : '深化過程'}
      />
      <ModalInfoElement
        title={'カデット'}
        titleColor={'black'}
        content={props?.cadet?.name}
      />
      <ModalInfoElement
        title={'Intraid'}
        titleColor={'black'}
        content={props?.cadet?.intraId}
      />
      <ModalInfoElement
        title={'紹介リンク'}
        titleColor={'black'}
        content={
          props?.cadet?.resumeUrl
            ? `${props?.cadet?.resumeUrl.slice(0, 25)}...`
            : 'リンクなし'
        }
        link={props?.cadet?.resumeUrl ? props?.cadet?.resumeUrl : ''}
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
          inputDisabled={false}
          countDisabled={false}
        />
      ) : (
        <InputCounter
          value={props.content}
          inputDisabled={true}
          countDisabled={true}
        />
      )}
    </Container>
  );
}
