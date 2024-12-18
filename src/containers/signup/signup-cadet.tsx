import axios from 'axios';
import singupImage from '../../assets/signup/signup.png';
import AuthStore from '../../states/auth/AuthStore';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Button,
  ContainersMobile,
  ContainersPc,
  HeadLetters,
  InfoInput,
  NameTitle,
  RequiredWrapper,
  SingupImage,
} from './signup-style';
import UserJoinStore from '../../states/user-join/UserJoinStore';
import { debounce } from '@mui/material';
import LoadingStore from '../../states/loading/LoadingStore';
import {
  OneButtonModal,
  OneButtonModalProps,
} from '../../components/modal/one-button-modal/one-button-modal';
import {
  DEFAULT_COOKIE_OPTION,
  setCookie,
  TOKEN_LIST,
} from '../../context/cookies';

const SignUpCadet = () => {
  const [name, setName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isRedirection, setIsRedirection] = useState<boolean>(false);
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
    window.innerWidth <= 500 ? setIsMobile(true) : setIsMobile(false);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = debounce(() => {
    if (window.innerWidth <= 500) setIsMobile(true);
    else setIsMobile(false);
  }, 10);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  async function joinCadetServer() {
    if (!name) {
      setOneButtonModalProps({
        TitleText: '実名を入力してください',
        Text: '実名を入力してください',
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

    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${AuthStore.getAccessToken()}`;

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/cadets/join`,
        {
          name: name,
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

  return (
    <>
      {!isMobile && (
        <ContainersPc>
          <RequiredWrapper>
            <HeadLetters>必須情報の入力</HeadLetters>
            <SingupImage src={singupImage} alt="singup-image" />
            <div style={{ paddingBottom: '5px' }}>
              <NameTitle>本人の実名</NameTitle>
              <InfoInput
                type="text"
                onChange={onNameChange}
                placeholder="報告書作成などに使用されます。"
                maxLength={10}
              ></InfoInput>
            </div>
          </RequiredWrapper>
          <Button
            style={{
              marginBottom: '5rem',
              marginRight: '6rem',
            }}
            onClick={() => joinCadetServer()}
          >
            提出
            {isRedirection && <Navigate to="/" />}
          </Button>
          {isError && <OneButtonModal {...oneButtonModalProps} />}
        </ContainersPc>
      )}
      {isMobile && (
        <ContainersMobile
          style={{
            marginLeft: '2.5rem',
          }}
        >
          <RequiredWrapper>
            <HeadLetters>必須情報の入力</HeadLetters>
            <SingupImage src={singupImage} alt="singup-image" />

            <div style={{ paddingBottom: '5px' }}>
              <NameTitle>本人の実名</NameTitle>
              <InfoInput
                type="text"
                onChange={onNameChange}
                placeholder="報告書作成などに使用されます。"
                maxLength={10}
              ></InfoInput>
            </div>
          </RequiredWrapper>
          <Button
            style={{
              marginBottom: '5rem',
              marginRight: '6rem',
            }}
            onClick={() => joinCadetServer()}
          >
            提出
            {isRedirection && <Navigate to="/" />}
          </Button>
          {isError && <OneButtonModal {...oneButtonModalProps} />}
        </ContainersMobile>
      )}
    </>
  );
};

export default SignUpCadet;
