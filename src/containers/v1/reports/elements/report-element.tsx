import {
  ReportElementRoot,
  Topic,
  Content,
} from '@/containers/v1/reports/elements/element-styled';

export interface ReportElementProps {
  topic: string;
  content: string;
}

export function ReportElement(props: ReportElementProps) {
  return (
    <ReportElementRoot>
      <Topic>{props.topic}</Topic>
      <Content>{props.content}</Content>
    </ReportElementRoot>
  );
}