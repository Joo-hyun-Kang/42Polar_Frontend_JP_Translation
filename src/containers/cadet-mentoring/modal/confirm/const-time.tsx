import styled from '@emotion/styled';
import defaultTheme from '../../../../styles/theme';
import { getDayToString, getTimeToString } from '../../../reports/report-form';

export const Title = styled.div`
  font-weight: bold;
  width: 40%;
  ${defaultTheme.fontSize.sizeSmall};
`;

export const Content = styled.div`
  text-decoration: underline;
  width: 60%;
`;

export const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 80%;
  margin: 10px;
  ${defaultTheme.font.nanumGothic};
  ${defaultTheme.fontSize.sizeSmall};
`;

export const constTime = (meetingAt: Date[]) => {
  return (
    <Container>
      <Title>お会いする時刻</Title>
      <Content style={{ textDecoration: 'none' }}>
        {meetingAt?.length && !isNaN(meetingAt[0].getHours()) ? (
          <>
            {getDayToString(meetingAt[0])} {getTimeToString(meetingAt)}
          </>
        ) : (
          '未定'
        )}
      </Content>
    </Container>
  );
};
