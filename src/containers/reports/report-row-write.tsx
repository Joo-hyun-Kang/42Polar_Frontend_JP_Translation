import {
  ReportRowContainer,
  ReportRowTitle,
  ReportRowContent,
} from './row-styled';
import styled from '@emotion/styled';
import defaultTheme from '../../styles/theme';
import { InputCounter } from '../../components/input-counter';

const ReportRowContentTitie = styled.div`
  width: 100%;
  margin: 20px 0px 0px 15px;
  justify-content: left;
  ${defaultTheme.fontSize.sizeMedium};
  ${defaultTheme.font.inter};
`;

const ReportSummaryTitle = styled.div`
  width: 100%;
  margin: 20px 10px 10px 40px;
  justify-content: left;
  ${defaultTheme.fontSize.sizeExtraSmall};
  ${defaultTheme.font.nanumGothic};
`;

interface ReportRowWriteProps {
  status: string;
  topic: string;
  setTopic: (s: string) => void;
  content: string;
  setContent: (s: string) => void;
  feedbackMessage: string;
  setFeedbackMessage: (s: string) => void;
  isEditPossible: boolean;
}

export function ReportRowWrite(props: ReportRowWriteProps) {
  return (
    <ReportRowContainer>
      <ReportRowTitle>報告書 作成</ReportRowTitle>
      <ReportRowContent>
        <ReportRowContentTitie>概要</ReportRowContentTitie>
        <ReportSummaryTitle>&#183; テーマ</ReportSummaryTitle>
        <InputCounter
          setter={props.setTopic}
          value={props.topic}
          maxLength={150}
          countDisabled={!props.isEditPossible}
          inputDisabled={!props.isEditPossible}
        />
        <ReportSummaryTitle>&#183; 内容</ReportSummaryTitle>
        <InputCounter
          setter={props.setContent}
          value={props.content}
          maxLength={800}
          countDisabled={!props.isEditPossible}
          inputDisabled={!props.isEditPossible}
        />
        <ReportSummaryTitle>&#183; 生徒に伝えたいこと</ReportSummaryTitle>
        <InputCounter
          setter={props.setFeedbackMessage}
          value={props.feedbackMessage}
          maxLength={800}
          countDisabled={!props.isEditPossible}
          inputDisabled={!props.isEditPossible}
          placeholder={
            '🌟 該当のフィードバックメッセージは、メンタリングを受けた生徒に送信されます！ 🌟\n'
          }
        />
      </ReportRowContent>
    </ReportRowContainer>
  );
}
