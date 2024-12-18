import styled from '@emotion/styled';
import { Container } from '@mui/system';
import { observer } from 'mobx-react-lite';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import defaultTheme from '../../styles/theme';
import { TableTitle } from './table-title';
import { TableColumnLine, TableRow } from './table-row';
import MentorLogStore, {
  LOGS_PER_PAGE,
  MentoringLogs,
} from '../../states/my-mentoring-mentor/MentorLogStore';
import { useEffect, useState } from 'react';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import { Email } from './email';
import MentorStore from '../../states/my-mentoring-mentor/MentorStore';
import { ApplyModal } from './modal/modal';
import {
  createTheme,
  Pagination,
  PaginationItem,
  ThemeProvider,
} from '@mui/material';
import theme from '../../styles/theme';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';

const NoneDrag = styled.div`
  width: 100%;
  height: calc(100vh - 205px);
  height: 100%;
`;

const Top = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  justify-content: center;
`;

const InfoTitle = styled.div`
  ${defaultTheme.font.inter};
  ${defaultTheme.fontSize.sizeMedium};
  font-weight: bold;
  margin-bottom: 10px;
`;

const Bottom = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
`;

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: left;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${defaultTheme.font.nanumGothic};
  background-color: white;
  padding: 20px 0px;
`;

const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.polarSimpleMain,
    },
    secondary: {
      main: theme.colors.polarBrightMain,
    },
  },
  typography: {
    fontFamily: theme.font.inter,
    fontSize: 20,
    fontWeightLight: 700,
  },
});

const INITIAL_PAGE = '1';

const MyMentoringMentor = observer(() => {
  const [params, setParams] = useSearchParams();
  const pageNumber = params.get('page');
  const { intraId } = useParams<string>();
  const [log, setLog] = useState<MentoringLogs>();
  const [applyModal, setApplyModal] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(false);

  useEffect(() => {
    async function initLog() {
      await MentorLogStore.Initializer(
        AuthStore.getAccessToken(),
        parseInt(pageNumber || INITIAL_PAGE),
      );
      setIsInit(true);
    }
    initLog();
  }, [pageNumber]);

  const RenderEmptyLine = () => {
    const result = [];
    for (let i = 0; i + MentorLogStore?.logs?.length < 15; ++i) {
      result.push(<TableColumnLine key={i} />);
    }
    return result;
  };

  useEffect(() => {
    if (!intraId) {
      return;
    }
    MentorStore.getMentor(intraId);
    return () => {
      MentorStore.clearMentor();
      MentorLogStore.clearLogs();
    };
  }, []);

  if (!AuthStore.getAccessToken()) {
    ErrorStore.on('ログインが必要なサービスです', ERROR_DEFAULT_VALUE.TITLE);
    AuthStore.Login();
    return <></>;
  } else if (AuthStore.getUserRole() !== USER_ROLES.MENTOR) {
    ErrorStore.on('アクセス権限がありません。', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else
    return (
      <NoneDrag>
        <Top>
          <ApplyModal
            log={log}
            applyModal={applyModal}
            setApplyModal={setApplyModal}
          />
          <Container component="main" maxWidth="lg">
            <InfoContainer>
              <InfoTitle>
                {MentorStore?.mentor?.intraId}のメンタリング
              </InfoTitle>
              <Email
                email={MentorStore?.mentor?.email}
                setEmail={MentorStore?.setEmail}
              />
            </InfoContainer>
          </Container>
        </Top>
        <Bottom>
          <Container component="main" maxWidth="lg">
            <TableTitle />
            {MentorLogStore.logs.map((e, i) => (
              <TableRow
                key={e.id}
                user={e.cadet.intraId}
                mentoringId={e.id}
                topic={e.topic}
                mentoringState={e.status}
                report={e.report}
                createdAt={e.createdAt}
                meetingAt={e.meetingAt}
                log={e}
                setApplyModal={setApplyModal}
                setLog={setLog}
              />
            ))}
            {RenderEmptyLine()}
          </Container>
        </Bottom>
        {isInit && (
          <PaginationContainer>
            <ThemeProvider theme={muiTheme}>
              <Pagination
                page={parseInt(pageNumber || INITIAL_PAGE)}
                count={Math.trunc(MentorLogStore.total / LOGS_PER_PAGE) + 1}
                renderItem={item => (
                  <PaginationItem
                    component={Link}
                    to={`/mentors/mentorings/${intraId}${`?page=${item.page}`}`}
                    {...item}
                  />
                )}
                size="large"
                color="primary"
              />
            </ThemeProvider>
          </PaginationContainer>
        )}
      </NoneDrag>
    );
});

export default MyMentoringMentor;
