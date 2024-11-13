import { debounce, Switch } from '@mui/material';
import axios from 'axios';
import singupImage from '../../assets/signup/signup.png';
import addButtonImage from '../../assets/signup/addButton.png';
import { useEffect, useRef, useState } from 'react';
import Columns from '../../components/signup/getColumns';
import React from 'react';
import LoadingStore from '../../states/loading/LoadingStore';
import { Navigate } from 'react-router-dom';
import MentorStore from '../../states/my-mentoring-mentor/MentorStore';
import AuthStore from '../../states/auth/AuthStore';
import UserJoinStore from '../../states/user-join/UserJoinStore';
import {
  AddButtonImage,
  BodyBigFont,
  BodySmallFont,
  Button,
  CertificationSendingButton,
  ColumnDays,
  ColumnLine,
  ColumnName,
  ContainersMobile,
  ContainersPc,
  HeadLetters,
  InfoInput,
  NameTitle,
  OptionWrapper,
  RequiredWrapper,
  ResultMessage,
  SingupImage,
  TimeTableContainer,
  ToggleContainer,
} from './signup-style';
import {
  OneButtonModal,
  OneButtonModalProps,
} from '../../components/modal/one-button-modal/one-button-modal';
import {
  DEFAULT_COOKIE_OPTION,
  setCookie,
  TOKEN_LIST,
} from '../../context/cookies';
import theme from '../../styles/theme';

interface AddColumnsProps {
  rows: IRows[];
  onRemove: (id: number) => void;
  onChange: (id: number, index: number, value: number) => void;
}

interface IRows {
  id: number;
  date: number[];
}

function AddColumns(props: AddColumnsProps) {
  return (
    <>
      {props.rows.map(rows => (
        <Columns
          key={rows.id}
          onRemove={props.onRemove}
          onChange={props.onChange}
          id={rows.id}
          date={rows.date}
        ></Columns>
      ))}
    </>
  );
}

enum AvailableTimeError {
  INPUT_ERROR,
  OVERLAP_ERROR,
  SUCCESS,
}

const SignUpMentor = () => {
  const [isRedirection, setIsRedirection] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [slackId, setSlackId] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [duty, setDuty] = useState<string>('');
  const [isMailSucess, setIsMailSucesss] = useState(false);
  const [isMailFail, setIsMailFail] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [mailOverlaped, setMailOverlaped] = useState<boolean>(false);
  const [checked, setChecked] = useState(true);
  const [code, setCode] = useState<string>('');
  const [isCodeSucess, setIsCodeSucesss] = useState(false);
  const [isCodeFail, setIsCodeFail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rows, setRows] = useState<IRows[]>([
    {
      id: 0,
      date: [0, 0, 0, 0, 0],
    },
  ]);
  const [isError, setIsError] = useState<boolean>(false);
  const [oneButtonModalProps, setOneButtonModalProps] =
    useState<OneButtonModalProps>({
      TitleText: '',
      Text: 'ss',
      XButtonFunc: () => {
        setIsError(false);
      },
      ButtonText: '',
      ButtonBg: '',
      ButtonFunc: () => {
        setIsError(false);
      },
    });

  useEffect(() => {
    UserJoinStore.off();
    MentorStore.getMentor(AuthStore.getUserIntraId());
    window.innerWidth <= 500 ? setIsMobile(true) : setIsMobile(false);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const nextId = useRef(1);

  const handleResize = debounce(() => {
    if (window.innerWidth <= 500) setIsMobile(true);
    else setIsMobile(false);
  }, 10);

  const onRowCreate = () => {
    const newRows: IRows = {
      id: nextId.current,
      date: [0, 0, 0, 0, 0],
    };
    setRows([...rows, newRows]);
    nextId.current += 1;
  };

  const onRowRemove = (id: number) => {
    setRows(rows.filter(rows => rows.id !== id));
  };

  const onRowChange = (id: number, index: number, value: number) => {
    const firstIndex = 0;
    const row = rows.filter(rows => rows.id === id);
    row[firstIndex].date[index] = value;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const onSlackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlackId(event.target.value);
  };

  const onCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(event.target.value);
  };

  const onDutyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuty(event.target.value);
  };

  async function validateRows(rows: IRows[]): Promise<boolean> {
    const invaild_data = -1;

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].date.length; j++) {
        if (rows[i].date[j] === invaild_data) {
          return false;
        }
      }
    }
    return true;
  }

  async function validateAvailableTime(
    time: IAvailableDate[][],
  ): Promise<AvailableTimeError> {
    for (let i = 0; i < time.length; i++) {
      for (let j = 0; j < time[i].length; j++) {
        if (!isValidTime(time[i][j])) {
          return AvailableTimeError.INPUT_ERROR;
        }
      }
    }

    for (let day = 0; day < 7; day++) {
      const length = time[day].length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
          if (i === j) {
            continue;
          }
          if (!validateTimeOverlap(time[day][i], time[day][j])) {
            return AvailableTimeError.OVERLAP_ERROR;
          }
        }
      }
    }
    return AvailableTimeError.SUCCESS;
  }

  function isValidTime(time: IAvailableDate): boolean {
    if (
      !(time.startHour >= 0 && time.startHour < 24) ||
      !(time.startMinute === 0 || time.startMinute === 30) ||
      !(time.endHour >= 0 && time.endHour < 24) ||
      !(time.endMinute === 0 || time.endMinute === 30)
    ) {
      return false;
    }
    if (time.startHour >= time.endHour) {
      return false;
    }
    const endTotalMinute = time.endHour * 60 + time.endMinute;
    const startTotalMinute = time.startHour * 60 + time.startMinute;
    if (endTotalMinute - startTotalMinute < 60) {
      return false;
    }
    return true;
  }

  function validateTimeOverlap(
    time1: IAvailableDate,
    time2: IAvailableDate,
  ): boolean {
    if (time1.startHour <= time2.startHour && time1.endHour > time2.startHour) {
      return false;
    }
    if (
      time1.endHour === time2.startHour &&
      time1.endMinute === 30 &&
      time2.startMinute === 0
    ) {
      return false;
    }
    if (time2.startHour <= time1.startHour && time2.endHour > time1.startHour) {
      return false;
    }
    if (
      time2.endHour === time1.startHour &&
      time2.endMinute === 30 &&
      time1.endMinute === 0
    ) {
      return false;
    }
    return true;
  }

  async function joinMentorServer(rows: IRows[]) {
    if (!name) {
      setOneButtonModalProps({
        TitleText: '名前の入力',
        Text: '名前を入力してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    if (!slackId) {
      setOneButtonModalProps({
        TitleText: 'Slack IDを記載してください',
        Text: 'Slack IDDを記載してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    if (!company) {
      setOneButtonModalProps({
        TitleText: '所属を記載してください',
        Text: '所属を記載してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    if (!duty) {
      setOneButtonModalProps({
        TitleText: '職級を記載してください',
        Text: '職級を記載してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    if (!alreadyRegistered && !isCodeSucess) {
      setOneButtonModalProps({
        TitleText: 'メール認証を完了してください',
        Text: 'メール認証を完了してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    LoadingStore.on();

    if (rows?.length === 0 && checked) {
      setOneButtonModalProps({
        TitleText: '可能な時間を入力',
        Text: '入力された可能な時間がありません',

        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      LoadingStore.off();
      return;
    }

    if (!(await validateRows(rows))) {
      setOneButtonModalProps({
        TitleText: '可能時間の空欄',
        Text: '可能時間に空欄があります',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      LoadingStore.off();
      return;
    }

    const availableTime: IAvailableDate[][] = await getAvailableTime(rows);

    const resultVaildation: AvailableTimeError = await validateAvailableTime(
      availableTime,
    );

    if (resultVaildation === AvailableTimeError.INPUT_ERROR) {
      setOneButtonModalProps({
        TitleText: '正しくない可能な時間',
        Text: '可能な時間は開始時間から1時間以上である必要があります',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      LoadingStore.off();
      return;
    } else if (resultVaildation === AvailableTimeError.OVERLAP_ERROR) {
      setOneButtonModalProps({
        TitleText: '可能時間の重複',
        Text: '選択された可能な時間に重複があります',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      LoadingStore.off();
      return;
    }

    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${AuthStore.getAccessToken()}`;

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/mentors/join`,
        {
          name: name,
          slackId: slackId,
          availableTime: availableTime,
          isActive: checked,
          company: company,
          duty: duty,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setOneButtonModalProps({
          TitleText: '提出に成功しました',
          Text: '提出に成功しました',
          XButtonFunc: () => {
            setIsError(false);
          },
          ButtonText: '確認',
          ButtonFunc: () => {
            setIsError(false);
          },
        });

        setIsError(true);

        setCookie(TOKEN_LIST.JOIN, 'true', DEFAULT_COOKIE_OPTION);

        setIsRedirection(true);
      } else {
        setOneButtonModalProps({
          TitleText: '提出に失敗しました',
          Text: '提出に失敗しました',
          XButtonFunc: () => {
            setIsError(false);
          },
          ButtonText: '確認',
          ButtonFunc: () => {
            setIsError(false);
          },
        });

        setIsError(true);
      }
    } catch (err) {
      setOneButtonModalProps({
        TitleText: '提出に失敗しました',
        Text: '提出に失敗しました',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
    } finally {
      LoadingStore.off();
    }
  }

  interface IAvailableDate {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }

  async function getAvailableTime(rows: IRows[]): Promise<IAvailableDate[][]> {
    const availableTime: IAvailableDate[][] = Array.from(Array(7), () =>
      Array(0).fill(null),
    );

    if (checked) {
      rows.map(row => {
        const temp: IAvailableDate = {
          startHour: row.date[1] % 24,
          startMinute: row.date[2] ? 30 : 0,
          endHour: row.date[3] % 24,
          endMinute: row.date[4] ? 30 : 0,
        };
        availableTime[row.date[0]].push(temp);
      });
    }

    return availableTime;
  }

  async function SendEmail(email: string) {
    if (!email) {
      setOneButtonModalProps({
        TitleText: 'メールアドレスを入力してください',
        Text: 'メールアドレスを入力してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });
      setIsError(true);
      return;
    }

    setIsMailSucesss(false);
    setIsMailFail(false);
    setAlreadyRegistered(false);
    setMailOverlaped(false);

    try {
      LoadingStore.on();
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${AuthStore.getAccessToken()}`;

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/mentors/email`,
        {
          email: email,
        },
      );

      if (response.status === 201) {
        setIsMailSucesss(true);
      } else {
        setIsMailFail(true);
      }
    } catch (error: any) {
      if (MentorStore.mentor.email === email) {
        setAlreadyRegistered(true);
      } else if (error.response && error.response.status === 409) {
        setMailOverlaped(true);
      } else {
        setIsMailFail(true);
      }
    } finally {
      LoadingStore.off();
    }
  }

  async function certificateEmail(code: string) {
    if (!code) {
      setOneButtonModalProps({
        TitleText: '認証コードを入力してください',
        Text: '認証コードを入力してください',
        XButtonFunc: () => {
          setIsError(false);
        },
        ButtonText: '確認',
        ButtonFunc: () => {
          setIsError(false);
        },
      });

      setIsError(true);
      return;
    }

    setIsCodeSucesss(false);
    setIsCodeFail(false);

    try {
      LoadingStore.on();

      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${AuthStore.getAccessToken()}`;

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/mentors/email/verifications/${code}`,
        {
          code: code,
        },
      );

      if (response.status === 201) {
        setIsCodeSucesss(true);
      } else {
        setIsCodeFail(true);
      }
    } catch (err) {
      setIsCodeFail(true);
    } finally {
      LoadingStore.off();
    }
  }

  return (
    <>
      {!isMobile && (
        <ContainersPc>
          <RequiredWrapper>
            <HeadLetters>必須情報の入力</HeadLetters>
            <SingupImage src={singupImage} alt="singup-image" />

            <div style={{ paddingBottom: '5px' }}>
              <NameTitle>お名前</NameTitle>
              <InfoInput
                type="text"
                onChange={onNameChange}
                placeholder="報告書作成などに使用されます。"
                maxLength={10}
              ></InfoInput>
            </div>

            <div style={{ paddingBottom: '0px', paddingTop: '15px' }}>
              <NameTitle>Slackのニックネーム</NameTitle>
              <InfoInput
                type="text"
                onChange={onSlackChange}
                maxLength={100}
                placeholder="42Slackのニックネームと同じものを入力してください。"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '12rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * カデットとの連絡に使用されます
              </div>
            </div>

            <div style={{ paddingBottom: '5px', paddingTop: '5px' }}>
              <NameTitle>所属</NameTitle>
              <InfoInput
                type="text"
                onChange={onCompanyChange}
                maxLength={100}
                placeholder="現在勤務中の会社名を記載してください。"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 在職証明書と同じ名称である必要があります
              </div>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 報告業務に使用 (運営陣のみに公開)
              </div>
            </div>
            <div style={{ paddingBottom: '5px', paddingTop: '5px' }}>
              <NameTitle>職級</NameTitle>
              <InfoInput
                type="text"
                onChange={onDutyChange}
                maxLength={100}
                placeholder="現在の職級を記入してください。（ない場合は「なし」と記載してください)"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 様々な形で記載しても構いません
              </div>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 報告業務に使用 (運営陣のみに公開)
              </div>
            </div>

            <>
              {alreadyRegistered && (
                <ResultMessage>
                  既にメールアドレスが登録されています
                </ResultMessage>
              )}
            </>
            <>
              {!alreadyRegistered && (
                <div>
                  <div style={{ paddingBottom: '5px' }}>
                    <NameTitle>e-mail</NameTitle>
                    <InfoInput
                      maxLength={100}
                      onChange={onEmailChange}
                      placeholder="メンタリング案内メールが送信されます。"
                    />
                  </div>
                  <div style={{ paddingBottom: '0px', marginBottom: '0px' }}>
                    <CertificationSendingButton
                      onClick={() => SendEmail(email)}
                    >
                      認証
                    </CertificationSendingButton>
                    <>
                      {isMailSucess && (
                        <ResultMessage>メール送信が完了しました</ResultMessage>
                      )}
                    </>
                    <>
                      {isMailFail && (
                        <ResultMessage>メール送信に失敗しました</ResultMessage>
                      )}
                    </>
                    <>
                      {mailOverlaped && (
                        <ResultMessage>
                          使用不可能なメールアドレスです
                        </ResultMessage>
                      )}
                    </>
                  </div>
                  <NameTitle style={{ paddingTop: '0px', marginTop: '0px' }}>
                    認証コード
                  </NameTitle>
                  <InfoInput
                    maxLength={10}
                    onChange={onCodeChange}
                    placeholder="認証コードを入力してください。"
                  />
                  <CertificationSendingButton
                    onClick={() => certificateEmail(code)}
                  >
                    確認
                  </CertificationSendingButton>
                  <>
                    {isCodeSucess && (
                      <ResultMessage>認証が完了しました</ResultMessage>
                    )}
                  </>
                  <>
                    {isCodeFail && (
                      <ResultMessage>認証に失敗しました</ResultMessage>
                    )}
                  </>
                </div>
              )}
            </>
          </RequiredWrapper>
          <OptionWrapper>
            <HeadLetters style={{ paddingLeft: '16rem' }}>
              メンタリング可能時間
            </HeadLetters>
            <ToggleContainer>
              <NameTitle>メンタリング可能/不可</NameTitle>
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ mb: 1, mr: -6 }}
              />
              <BodySmallFont style={{ paddingBottom: '6px' }}>
                可能
              </BodySmallFont>
            </ToggleContainer>
            <NameTitle
              style={{
                paddingLeft: '1rem',
                height: '0rem',
              }}
            >
              時間
            </NameTitle>
            <TimeTableContainer style={{ marginTop: '0rem' }}>
              <ColumnDays>
                <BodyBigFont>曜日</BodyBigFont>
              </ColumnDays>
              <ColumnName>
                <BodyBigFont>可能時間</BodyBigFont>
              </ColumnName>
              <ColumnLine></ColumnLine>
            </TimeTableContainer>
            <>
              {checked && (
                <AddColumns
                  rows={rows}
                  onRemove={onRowRemove}
                  onChange={onRowChange}
                />
              )}
            </>
            <AddButtonImage
              src={addButtonImage}
              alt="add-button-image"
              style={{ paddingLeft: '27.7rem' }}
              onClick={onRowCreate}
            />
            <Button
              style={{
                marginBottom: '5rem',
                marginLeft: '20rem',
                marginTop: '10rem',
              }}
              onClick={() => joinMentorServer(rows)}
            >
              提出
              {isRedirection && <Navigate to="/" />}
            </Button>
            {isError && <OneButtonModal {...oneButtonModalProps} />}
          </OptionWrapper>
        </ContainersPc>
      )}
      {isMobile && (
        <ContainersMobile>
          <RequiredWrapper>
            <HeadLetters>必須情報の入力</HeadLetters>
            <SingupImage src={singupImage} alt="singup-image" />

            <div style={{ paddingBottom: '5px' }}>
              <NameTitle>お名前</NameTitle>
              <InfoInput
                type="text"
                onChange={onNameChange}
                placeholder="報告書作成などに使用されます。"
                maxLength={10}
              ></InfoInput>
            </div>

            <div style={{ paddingBottom: '0px', paddingTop: '15px' }}>
              <NameTitle>Slackのニックネーム</NameTitle>
              <InfoInput
                type="text"
                onChange={onSlackChange}
                maxLength={100}
                placeholder="42Slackのニックネームと同じものを入力してください。"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '12rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * カデットとの連絡に使用されます
              </div>
            </div>

            <div style={{ paddingBottom: '5px', paddingTop: '5px' }}>
              <NameTitle>所属</NameTitle>
              <InfoInput
                type="text"
                onChange={onCompanyChange}
                maxLength={100}
                placeholder="現在勤務中の会社名を記載してください。"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 在職証明書と同じ名称である必要があります
              </div>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 報告業務に使用 (運営陣のみに公開)
              </div>
            </div>
            <div style={{ paddingBottom: '5px', paddingTop: '5px' }}>
              <NameTitle>職級</NameTitle>
              <InfoInput
                type="text"
                onChange={onDutyChange}
                maxLength={100}
                placeholder="現在の職級を記入してください。（ない場合は「なし」と記載してください)"
                color="blue"
              ></InfoInput>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 様々な形で記載しても構いません
              </div>
              <div
                style={{
                  color: `${theme.colors.fontGray}`,
                  marginBottom: '0rem',
                  paddingLeft: '3rem',
                  paddingBottom: '0rem',
                  fontSize: '1.5rem',
                }}
              >
                * 報告業務に使用 (運営陣のみに公開)
              </div>
            </div>

            <>
              {alreadyRegistered && (
                <ResultMessage>
                  既にメールアドレスが登録されています
                </ResultMessage>
              )}
            </>
            <>
              {!alreadyRegistered && (
                <div>
                  <div style={{ paddingBottom: '5px' }}>
                    <NameTitle>e-mail</NameTitle>
                    <InfoInput
                      maxLength={100}
                      onChange={onEmailChange}
                      placeholder="メンタリング案内メールが送信されます。"
                    />
                  </div>
                  <div style={{ paddingBottom: '0px', marginBottom: '0px' }}>
                    <CertificationSendingButton
                      onClick={() => SendEmail(email)}
                    >
                      認証
                    </CertificationSendingButton>
                    <>
                      {isMailSucess && (
                        <ResultMessage>メール送信が完了しました</ResultMessage>
                      )}
                    </>
                    <>
                      {isMailFail && (
                        <ResultMessage>メール送信に失敗しました</ResultMessage>
                      )}
                    </>
                    <>
                      {mailOverlaped && (
                        <ResultMessage>
                          使用不可能なメールアドレスです
                        </ResultMessage>
                      )}
                    </>
                  </div>
                  <NameTitle style={{ paddingTop: '0px', marginTop: '0px' }}>
                    認証コード
                  </NameTitle>
                  <InfoInput
                    maxLength={10}
                    onChange={onCodeChange}
                    placeholder="認証コードを入力してください。"
                  />
                  <CertificationSendingButton
                    onClick={() => certificateEmail(code)}
                  >
                    確認
                  </CertificationSendingButton>
                  <>
                    {isCodeSucess && (
                      <ResultMessage>認証が完了しました</ResultMessage>
                    )}
                  </>
                  <>
                    {isCodeFail && (
                      <ResultMessage>認証に失敗しました</ResultMessage>
                    )}
                  </>
                </div>
              )}
            </>
          </RequiredWrapper>
          <OptionWrapper>
            <HeadLetters style={{ paddingLeft: '16rem' }}>
              メンタリング可能時間
            </HeadLetters>
            <ToggleContainer>
              <NameTitle>メンタリング可能/不可</NameTitle>
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ mb: 1, mr: -6 }}
              />
              <BodySmallFont style={{ paddingBottom: '6px' }}>
                可能
              </BodySmallFont>
            </ToggleContainer>
            <NameTitle
              style={{
                paddingLeft: '1rem',
                height: '0rem',
              }}
            >
              時間
            </NameTitle>
            <TimeTableContainer style={{ marginTop: '0rem' }}>
              <ColumnDays>
                <BodyBigFont>曜日</BodyBigFont>
              </ColumnDays>
              <ColumnName>
                <BodyBigFont>可能時間</BodyBigFont>
              </ColumnName>
              <ColumnLine></ColumnLine>
            </TimeTableContainer>
            <>
              {checked && (
                <AddColumns
                  rows={rows}
                  onRemove={onRowRemove}
                  onChange={onRowChange}
                />
              )}
            </>
            <AddButtonImage
              src={addButtonImage}
              alt="add-button-image"
              style={{ paddingLeft: '27.7rem' }}
              onClick={onRowCreate}
            />
            <Button
              style={{
                marginBottom: '5rem',
                marginLeft: '20rem',
                marginTop: '10rem',
              }}
              onClick={() => joinMentorServer(rows)}
            >
              提出
              {isRedirection && <Navigate to="/" />}
            </Button>
            {isError && <OneButtonModal {...oneButtonModalProps} />}
          </OptionWrapper>
        </ContainersMobile>
      )}
    </>
  );
};

export default SignUpMentor;
