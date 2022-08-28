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
        title={'멘토링 구분'}
        titleColor={'black'}
        content={props?.cadet?.isCommon ? '공통과정' : '심화과정'}
        link={''}
      />
      <ModalInfoElement
        title={'카뎃 이름'}
        titleColor={'black'}
        content={props?.cadet?.name}
        link={''}
      />
      <ModalInfoElement
        title={'카뎃 Intra ID'}
        titleColor={'black'}
        content={props?.cadet?.intraId}
        link={''}
      />
      <ModalInfoElement
        title={'카뎃 이력서'}
        titleColor={'black'}
        content={
          props?.cadet?.resumeUrl
            ? `${props?.cadet?.resumeUrl.slice(0, 30)}...`
            : '링크 없음'
        }
        link={props?.cadet?.resumeUrl ? props?.cadet?.resumeUrl : ''}
      />
      <ModalInfoElement
        title={'멘토링 주제'}
        titleColor={'black'}
        content={props?.mentoringTopic}
        link={''}
      />
      <ModalInfoElement
        title={props.isReject ? '취소 사유' : '질문 내용'}
        titleColor={defaultTheme.colors.polarSimpleMain}
        content={''}
        link={''}
      />
      {props.isReject ? (
        <InputCounter
          setter={props.rejectReasonSetter}
          value={props.rejectReason}
          maxLength={250}
          disabled={false}
        />
      ) : (
        <InputCounter value={props.content} disabled={true} />
      )}
    </Container>
  );
}
