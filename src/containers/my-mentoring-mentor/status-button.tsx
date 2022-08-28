import styled from '@emotion/styled';
import defaultTheme from '../../styles/theme';

const StatusColumn = styled.div`
  ${defaultTheme.font.nanumGothic};
  ${defaultTheme.fontSize.sizeExtraSmall};
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
`;

const MENTORING_STATUS = {
  WAIT: '대기중',
  CONFIRM: '확정',
  DONE: '완료',
  CANCLE: '취소',
};

export interface ReportButtonProps {
  status: string;
}

export function StatusButton(props: ReportButtonProps) {
  return (
    <>
      {props.status === MENTORING_STATUS.WAIT ||
      props.status === MENTORING_STATUS.CONFIRM ? (
        <StatusColumn
          style={{
            color: defaultTheme.colors.polarSimpleMain,
            fontWeight: 'bold',
          }}
        >
          {props.status}
        </StatusColumn>
      ) : (
        <StatusColumn>{props.status}</StatusColumn>
      )}
    </>
  );
}
