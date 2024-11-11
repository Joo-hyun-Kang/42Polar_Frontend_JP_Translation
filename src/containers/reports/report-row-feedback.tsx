import {
  ReportRowContainer,
  ReportRowTitle,
  ReportRowContent,
} from './row-styled';
import styled from '@emotion/styled';
import { Rating } from '@mui/material';
import defaultTheme from '../../styles/theme';

const ReportRowContentTitie = styled.div`
  width: 100%;
  margin: 20px 0px 0px 15px;
  justify-content: left;
  ${defaultTheme.fontSize.sizeMedium};
  ${defaultTheme.font.inter};
`;

const ReportFeedbackRow = styled.div`
  display: flex;
  width: 400px;
  margin: 10px;
  justify-content: space-between;
  align-items: center;
  ${defaultTheme.fontSize.sizeExtraSmall};
  ${defaultTheme.font.nanumGothic};
`;

interface ReportRowFeedbackProps {
  feedback1: number;
  setFeedback1: (n: number) => void;
  feedback2: number;
  setFeedback2: (n: number) => void;
  feedback3: number;
  setFeedback3: (n: number) => void;
  isEditPossible: boolean;
}

export function ReportRowFeedback(props: ReportRowFeedbackProps) {
  return (
    <ReportRowContainer>
      <ReportRowTitle>フィードバック</ReportRowTitle>
      <ReportRowContent>
        <ReportRowContentTitie>
          メンタリング フィードバック
        </ReportRowContentTitie>
        <ReportFeedbackRow>
          1. 生徒が質問をよく整理して持ってきたか？
          <Rating
            name="simple-controlled"
            defaultValue={5}
            value={props.feedback1}
            onChange={(event, newValue) => {
              if (newValue) {
                props.setFeedback1(newValue);
              }
            }}
            readOnly={!props.isEditPossible}
          />
        </ReportFeedbackRow>
        <ReportFeedbackRow>
          2. 生徒との時間は満足のいくものだったか？
          <Rating
            name="simple-controlled"
            defaultValue={5}
            value={props.feedback2}
            onChange={(event, newValue) => {
              if (newValue) {
                props.setFeedback2(newValue);
              }
            }}
            readOnly={!props.isEditPossible}
          />
        </ReportFeedbackRow>
        <ReportFeedbackRow>
          3. 生徒が伝えた内容をよく理解したか？
          <Rating
            name="simple-controlled"
            defaultValue={5}
            value={props.feedback3}
            onChange={(event, newValue) => {
              if (newValue) {
                props.setFeedback3(newValue);
              }
            }}
            readOnly={!props.isEditPossible}
          />
        </ReportFeedbackRow>
      </ReportRowContent>
    </ReportRowContainer>
  );
}
