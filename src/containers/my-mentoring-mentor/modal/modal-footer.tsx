import styled from '@emotion/styled';
import { axiosInstance } from '../../../context/axios-interface';
import AuthStore from '../../../states/auth/AuthStore';
import LoadingStore from '../../../states/loading/LoadingStore';
import defaultTheme from '../../../styles/theme';

const ModalFooterContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Button = styled.div`
  ${defaultTheme.font.sebangGothic};
  ${defaultTheme.fontSize.sizeExtraSmall};
  color: ${defaultTheme.fontColor.whiteColor};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  margin: 10px 20px;
  border-radius: 10px;
  &:hover {
    opacity: 0.8;
  }
`;

const rejectMentoring = async (
  mentoringLogId: string,
  rejectMessage: string,
  token: string,
) => {
  LoadingStore.on();
  await axiosInstance
    .patch(
      `/mentoring-logs/reject`,
      {
        mentoringLogId: mentoringLogId,
        rejectMessage: rejectMessage,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    )
    .then(() => {
      alert('거절 요청 성공');
      location.reload();
    })
    .catch(err => {
      alert(`${err?.response?.data?.message}`);
    });
  LoadingStore.off();
};

const approveMentoring = async (
  mentoringLogId: string,
  selectedAt: Date[],
  token: string,
) => {
  LoadingStore.on();
  await axiosInstance
    .patch(
      `/mentoring-logs/approve`,
      {
        mentoringLogId: mentoringLogId,
        meetingAt: selectedAt,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    )
    .then(() => {
      alert('수락 요청 성공');
      location.reload();
    })
    .catch(err => {
      alert(`${err?.response?.data?.message}`);
    });
  LoadingStore.off();
};

interface ModalFooterProps {
  id: string;
  status: string;
  isReject: boolean;
  setIsReject: (b: boolean) => void;
  rejectReason: string;
  selectedTime: Date[];
}

export function ModalFooter(props: ModalFooterProps) {
  if (props.status === '대기중') {
    if (props.isReject) {
      return (
        <ModalFooterContainer>
          <Button
            style={{ backgroundColor: defaultTheme.colors.Red }}
            onClick={() => {
              rejectMentoring(props.id, props.rejectReason, AuthStore.jwt);
            }}
          >
            거절
          </Button>
          <Button
            style={{ backgroundColor: 'gray' }}
            onClick={() => {
              props.setIsReject(false);
            }}
          >
            취소
          </Button>
        </ModalFooterContainer>
      );
    }
    return (
      <ModalFooterContainer>
        <Button
          style={{ backgroundColor: defaultTheme.colors.polarSimpleMain }}
          onClick={() => {
            approveMentoring(props.id, props.selectedTime, AuthStore.jwt);
          }}
        >
          수락
        </Button>
        <Button
          style={{ backgroundColor: 'gray' }}
          onClick={() => {
            props.setIsReject(true);
          }}
        >
          거절
        </Button>
      </ModalFooterContainer>
    );
  } else if (props.status === '확정') {
    if (props.isReject) {
      return (
        <ModalFooterContainer>
          <Button
            style={{ backgroundColor: defaultTheme.colors.Red }}
            onClick={() => {
              rejectMentoring(props.id, props.rejectReason, AuthStore.jwt);
            }}
          >
            거절
          </Button>
          <Button
            style={{ backgroundColor: 'gray' }}
            onClick={() => {
              props.setIsReject(false);
            }}
          >
            취소
          </Button>
        </ModalFooterContainer>
      );
    }
    return (
      <ModalFooterContainer>
        <Button
          style={{ backgroundColor: 'gray' }}
          onClick={() => {
            props.setIsReject(true);
          }}
        >
          거절
        </Button>
      </ModalFooterContainer>
    );
  }
  return <></>;
}