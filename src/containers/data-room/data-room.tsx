import theme from '../../styles/theme';
import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import { Pagination } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Button from '../../components/button';
import { ThemeProvider } from '@mui/system';
import styled from 'styled-components';
import SearchBox from '../../components/data-room/search-box';
import DataRoomList from './data-room-list';
import AuthStore, { USER_ROLES } from '../../states/auth/AuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { dataRoomQuery } from '../../interface/data-room/data-room-query.interface';
import { useMediaQuery } from 'react-responsive';
import LoadingStore from '../../states/loading/LoadingStore';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import { NowDateKr } from '../../states/date-kr';
import {
  axiosWithNoData,
  AXIOS_METHOD_WITH_NO_DATA,
} from '../../context/axios-interface';
import axios from 'axios';
import { RequestErrorResponse } from '../apply-page/apply-page';
import { dataRoomProps } from '../../interface/data-room/data-room-props.interface';

export const muiPaginationTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.polarSimpleMain,
    },
    secondary: {
      main: theme.colors.polarBrightMain,
    },
  },
  typography: {
    fontFamily: 'inter',
    fontSize: 20,
    fontWeightLight: 700,
  },
});

const DataRoomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DataRoomTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  height: 10rem;
  padding-left: 3rem;
  padding-bottom: 2rem;
  ${theme.fontFrame.titleMedium}
`;

const DataRoomButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  height: 4rem;
  ${theme.fontFrame.titleMedium}
`;

const DataRoomNavigationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const DataRoomButton = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-left: 1rem;
  ${theme.fontFrame.titleMedium}
`;

const Back = styled.div`
  position: fixed;
  width: 100%;
  height: 23rem;
  top: 0;
  left: 0;
`;

const DRButton = styled(Button)`
  z-index: 100;
`;

const DRButtonReport = styled(Button)`
  z-index: 100;
  background-color: ${theme.colors.polarSimpleMain};
  border-radius: 30%;
`;

const DRButtonReportAll = styled(Button)`
  z-index: 100;
  background-color: ${theme.colors.polarSimpleMain};
  border-radius: 20%;
`;

type DRProps = {
  children: ReactNode;
};

const DataRoomBodyForPcLarge = styled.div`
  width: 120rem;
`;
const DataRoomBodyForPcSmall = styled.div`
  width: 160rem;
  margin-left: -10rem;
  margin-right: -10rem;
  -webkit-transform: scale(0.75);
  transform: scale(0.75);
  transform-origin: top;
`;

function DataRoom() {
  const take = 20; //한 페이지
  const [page, setPage] = useState<number>(1); //현재 페이지
  const [total, setTotal] = useState<number>(0); //전체 값
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [query, setQuery] = useState<dataRoomQuery>({
    page: page,
    take: take,
    isAscending: false,
  });
  const [datas, setDatas] = useState<dataRoomProps[]>(
    Array(query.take).fill({}),
  );
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorModalMsg, setErrorModalMsg] = useState<string>('');
  const onClickSearchBoxModal = useCallback(() => {
    setIsOpenModal(!isOpenModal);
  }, [isOpenModal]);
  const navigate = useNavigate();
  const isDesktopLarge = useMediaQuery({
    minWidth: 900,
  });
  const isDesktopSmall = useMediaQuery({
    maxWidth: 900,
    minWidth: 500,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const DataRoomBodyForDesktop: React.FC<DRProps> = props => {
    return (
      <>
        {isDesktopLarge ? (
          <DataRoomBodyForPcLarge>{props.children}</DataRoomBodyForPcLarge>
        ) : (
          <DataRoomBodyForPcSmall>{props.children}</DataRoomBodyForPcSmall>
        )}
      </>
    );
  };

  useEffect(() => {
    LoadingStore.on();
    let url = `/bocals/data-room?page=${query.page}&take=${query.take}`;

    if (query.isAscending)
      url = url.concat(`&isAscending=${query.isAscending}`);
    if (query.date) url = url.concat(`&date=${query.date}`);
    if (query.mentorIntra)
      url = url.concat(`&mentorIntra=${query.mentorIntra}`);
    if (query.mentorName) url = url.concat(`&mentorName=${query.mentorName}`);

    try {
      axiosWithNoData(AXIOS_METHOD_WITH_NO_DATA.GET, url, {
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
        },
      })
        .then(async response => {
          if (response.status === 200) {
            const tmpOffset: number =
              query.page * query.take > response.data.total
                ? response.data.total % query.take
                : query.take;

            if (tmpOffset < query.take) {
              setDatas(
                response.data.reports.concat(
                  Array(query.take - tmpOffset).fill({}),
                ),
              );
            } else setDatas(response.data.reports);
            setTotal(response.data.total);
            setOffset(tmpOffset);
          } else {
            ErrorStore.on(
              'データを取得中にエラーが発生しました。',
              ERROR_DEFAULT_VALUE.TITLE,
            );
          }
        })
        .catch(error => {
          if (axios.isAxiosError(error)) {
            const message = (error.response?.data as RequestErrorResponse)
              .message;
            ErrorStore.on(message, ERROR_DEFAULT_VALUE.TITLE);
          } else
            ErrorStore.on(
              'データを取得中にエラーが発生しました。',
              ERROR_DEFAULT_VALUE.TITLE,
            );
          if (error.response?.status === 401 || error.response?.status === 403)
            navigate('/');
        })
        .finally(() => {
          setIsLoading(false);
          LoadingStore.off();
        });
    } catch (error) {
      ErrorStore.on(
        'データを取得中にエラーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
    }
  }, [query, offset, setOffset, setTotal, total]);

  const SetReportStatusAllToModify = async () => {
    LoadingStore.on();

    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/reports/all/edit`;

    try {
      const res = await fetch(realurl, {
        method: 'PATCH',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
          'Content-type': 'application/json',
        },
      });

      if (res.status === 200) {
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'レーポットの状態の更新中にエラーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'レーポットの状態の更新中にエラーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();

    window.location.reload();
  };

  const SetReportStatusAllToDone = async () => {
    LoadingStore.on();

    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/reports/all/done`;

    try {
      const res = await fetch(realurl, {
        method: 'PATCH',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
          'Content-type': 'application/json',
        },
      });

      if (res.status === 200) {
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'レーポットの状態の更新中にエラーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'レーポットの状態の更新中にエラーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();

    window.location.reload();
  };

  const SetReportStatusToModify = async () => {
    LoadingStore.on();

    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/reports/edit`;
    const data = {
      id: selectedList,
    };

    if (selectedList.length === 0) {
      LoadingStore.off();
      setErrorModalMsg('メンタリング情報を1つ以上選択してください。');
      setErrorModal(true);
      return;
    }

    try {
      const res = await fetch(realurl, {
        method: 'PATCH',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status === 200) {
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'レーポットの状態の更新中にエラーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'レーポットの状態の更新中にエラーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();

    window.location.reload();
  };

  const SetReportStatusToDone = async () => {
    LoadingStore.on();

    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/reports/done`;
    const data = {
      id: selectedList,
    };

    if (selectedList.length === 0) {
      LoadingStore.off();
      setErrorModalMsg('メンタリング情報を1つ以上選択してください。');
      setErrorModal(true);
      return;
    }

    try {
      const res = await fetch(realurl, {
        method: 'PATCH',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status === 200) {
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'レーポットの状態の更新中にエラーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'レーポットの状態の更新中にエラーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();

    window.location.reload();
  };

  const getExcel = async () => {
    LoadingStore.on();
    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/excel`;
    const data = {
      reportIds: selectedList,
    };

    if (selectedList.length === 0) {
      LoadingStore.off();
      setErrorModalMsg('メンタリング情報を1つ以上選択してください。');
      setErrorModal(true);
      return;
    }

    try {
      const res = await fetch(realurl, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status === 201) {
        const blob = await res.blob();
        const newBlob = new Blob([blob]);
        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute(
          'download',
          `mentoring-data_${NowDateKr()
            .toLocaleDateString('ko-KR')
            .replaceAll(' ', '')}xlsx`,
        );
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'Excelデータを取得中にえらーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'Excelデータを取得中にえらーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();
  };

  const getExcelAll = async () => {
    LoadingStore.on();
    const realurl = `${process.env.REACT_APP_BASE_BACKEND_URL}/bocals/data-room/all/excel`;

    try {
      const res = await fetch(realurl, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${AuthStore.getAccessToken()}`,
        },
      });

      if (res.status === 201) {
        const blob = await res.blob();
        const newBlob = new Blob([blob]);
        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute(
          'download',
          `mentoring-data_${NowDateKr()
            .toLocaleDateString('ko-KR')
            .replaceAll(' ', '')}xlsx`,
        );
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      } else {
        LoadingStore.off();
        ErrorStore.on(
          'Excelデータを取得中にえらーが発生しました。',
          ERROR_DEFAULT_VALUE.TITLE,
        );
        return;
      }
    } catch (error) {
      LoadingStore.off();
      ErrorStore.on(
        'Excelデータを取得中にえらーが発生しました。',
        ERROR_DEFAULT_VALUE.TITLE,
      );
      return;
    }

    LoadingStore.off();
  };

  function printReports() {
    LoadingStore.on();
    let url = '/report-detail?autoPrint=true';
    if (selectedList.length === 0) {
      LoadingStore.off();
      setErrorModalMsg('メンタリング情報を一つ以上選択してください');
      setErrorModal(true);
      return;
    }
    selectedList.forEach(data => (url += `&reportId=${data}`));
    LoadingStore.off();
    navigate(url);
  }

  if (!AuthStore.getAccessToken()) {
    ErrorStore.on('ログインが必要なサービスです。', ERROR_DEFAULT_VALUE.TITLE);
    AuthStore.Login();
    return <></>;
  } else if (AuthStore.getUserRole() !== USER_ROLES.BOCAL) {
    ErrorStore.on('アクセス権限がありません。', ERROR_DEFAULT_VALUE.TITLE);
    return <Navigate to="/" />;
  } else
    return (
      <>
        {errorModal && (
          <OneButtonModal
            TitleText="⚠️ 42Polar 警告"
            Text={errorModalMsg}
            XButtonFunc={() => {
              setErrorModal(false);
            }}
            ButtonText="閉じる"
            ButtonBg="gray"
            ButtonFunc={() => {
              setErrorModal(false);
            }}
          />
        )}
        {!isLoading && (
          <DataRoomDiv>
            <DataRoomBodyForDesktop>
              <DataRoomTitle>データルーム</DataRoomTitle>
              <DataRoomButtonDiv>
                <DataRoomButton>
                  {isOpenModal && (
                    <>
                      <Back onClick={onClickSearchBoxModal}></Back>
                      <SearchBox
                        query={query}
                        setPage={setPage}
                        setQuery={setQuery}
                        setSelectedList={setSelectedList}
                      />
                    </>
                  )}
                  <DRButton text="ソート" onClick={onClickSearchBoxModal} />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButton text="出力" onClick={printReports} />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButton
                    text="選択をExcel保存"
                    width="15rem"
                    onClick={getExcel}
                  />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButton
                    text="全データをExcel保存"
                    width="18rem"
                    onClick={getExcelAll}
                  />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButtonReport
                    text="選択修正"
                    width="10rem"
                    onClick={SetReportStatusToModify}
                  />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButtonReport
                    text="選択完了"
                    width="10rem"
                    onClick={SetReportStatusToDone}
                  />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButtonReportAll
                    text="全体修正"
                    width="10rem"
                    onClick={SetReportStatusAllToModify}
                  />
                </DataRoomButton>
                <DataRoomButton>
                  <DRButtonReportAll
                    text="全体完了"
                    width="10rem"
                    onClick={SetReportStatusAllToDone}
                  />
                </DataRoomButton>
              </DataRoomButtonDiv>
              {DataRoomList(
                query,
                setQuery,
                offset,
                datas,
                selectedList,
                setSelectedList,
                isDesktopLarge || isDesktopSmall,
              )}
              <DataRoomNavigationDiv>
                <ThemeProvider theme={muiPaginationTheme}>
                  <Pagination
                    count={Math.ceil(total / take)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    page={page}
                    onChange={(_, page) => {
                      setPage(page);
                      setQuery({ ...query, page: page });
                      setOffset(page * take > total ? total % take : take);
                    }}
                  />
                </ThemeProvider>
              </DataRoomNavigationDiv>
            </DataRoomBodyForDesktop>
          </DataRoomDiv>
        )}
      </>
    );
}

export default DataRoom;
