import styled from '@emotion/styled';
import { axiosInstance } from '../../context/axios-interface';
import AuthStore from '../../states/auth/AuthStore';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import ReportStore from '../../states/repoort/ReportStore';
import defaultTheme from '../../styles/theme';
import { REPORT_STATE } from './report-form';

const PageTitle = styled.div`
  ${defaultTheme.font.inter};
  ${defaultTheme.fontSize.sizeMedium};
  border-top: 2px solid black;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0px 20px 30px;
  margin: 50px 0px;
  display: flex;
`;

export interface TitleProps {
  title: string;
}

export function Title(props: TitleProps) {
  return (
    <>
      <PageTitle>
        {props.title}
        {ReportStore.report.status === REPORT_STATE.EDIT_IMPOSSIBLE && (
          <> (作成完了, 修正不可)</>
        )}
        {ReportStore.report.status === REPORT_STATE.EDIT_ONLYONE && (
          <> (修正期間中, 提出後も修正可能)</>
        )}
      </PageTitle>
    </>
  );
}
