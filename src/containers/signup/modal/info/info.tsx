import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  OneButtonModal,
  OneButtonModalProps,
} from '../../../../components/modal/one-button-modal/one-button-modal';
import AuthStore from '../../../../states/auth/AuthStore';
import LoadingStore from '../../../../states/loading/LoadingStore';
import theme from '../../../../styles/theme';
import { MentorsData } from '../mentor-details-modal-inteface';
import {
  CertificationSendingButton,
  Container,
  InfoInput,
  NameTitle,
  ResultMessage,
} from './info-style';

interface InfoProps {
  setName: React.Dispatch<React.SetStateAction<string>>;
  setSlackId: React.Dispatch<React.SetStateAction<string>>;
  setAlreadyRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCodeSucesss: React.Dispatch<React.SetStateAction<boolean>>;
  setMentorsData: React.Dispatch<React.SetStateAction<MentorsData>>;
  alreadyRegistered: boolean;
  isCodeSucess: boolean;
  MentorsData: MentorsData;
}

export function Info(props: InfoProps) {
  const defaultSlackId = props.MentorsData.slackId;
  const defaultEmail = props.MentorsData.email;
  const defaultName = props.MentorsData.name;
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>(defaultEmail);
  const [isMailSucess, setIsMailSucesss] = useState(false);
  const [isMailFail, setIsMailFail] = useState(false);
  const [mailOverlaped, setMailOverlaped] = useState<boolean>(false);
  const [isCodeFail, setIsCodeFail] = useState(false);
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
    setEmail(defaultEmail);
    props.setName(defaultName);
    props.setSlackId(defaultSlackId);
  }, [defaultEmail, defaultName, defaultSlackId]);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setName(event.target.value);
  };

  const onSlackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setSlackId(event.target.value);
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  async function SendEmail() {
    if (!email) {
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

    setIsMailSucesss(false);
    setIsMailFail(false);
    props.setAlreadyRegistered(false);
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
      if (props.MentorsData.email === email) {
        props.setAlreadyRegistered(true);
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

    props.setIsCodeSucesss(false);
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
        props.setIsCodeSucesss(true);
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
    <Container>
      <div style={{ paddingBottom: '5px' }}>
        <NameTitle>お名前</NameTitle>
        <InfoInput
          type="text"
          onChange={onNameChange}
          placeholder="報告書作成などに使用されます。"
          maxLength={10}
          defaultValue={defaultName}
        ></InfoInput>
      </div>
      <div
        style={{
          paddingBottom: '5px',
          paddingTop: '15px',
        }}
      >
        <NameTitle>Slackのニックネーム</NameTitle>
        <InfoInput
          type="text"
          onChange={onSlackChange}
          maxLength={100}
          placeholder="42Slackのニックネームと同じものを入力してください。"
          color="blue"
          defaultValue={defaultSlackId}
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
          * カデットとの連絡に使用
        </div>
      </div>
      <>
        {props.alreadyRegistered && (
          <ResultMessage>既にメールアドレスが登録されています</ResultMessage>
        )}
      </>
      <>
        {!props.alreadyRegistered && (
          <div>
            <div style={{ paddingBottom: '5px' }}>
              <NameTitle>e-mail</NameTitle>
              <InfoInput
                maxLength={100}
                onChange={onEmailChange}
                placeholder="メンタリング案内メールが送信されます。"
                defaultValue={defaultEmail}
                required
              />
            </div>
            <div style={{ paddingBottom: '0px', marginBottom: '0px' }}>
              <CertificationSendingButton onClick={() => SendEmail()}>
                認証
              </CertificationSendingButton>
              {isError && <OneButtonModal {...oneButtonModalProps} />}
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
                  <ResultMessage> 使用不可能なメールアドレスです</ResultMessage>
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
            <CertificationSendingButton onClick={() => certificateEmail(code)}>
              確認
            </CertificationSendingButton>
            <>
              {props.isCodeSucess && (
                <ResultMessage>認証が完了しました</ResultMessage>
              )}
            </>
            <>{isCodeFail && <ResultMessage>認証に失敗しまし</ResultMessage>}</>
          </div>
        )}
      </>
    </Container>
  );
}
