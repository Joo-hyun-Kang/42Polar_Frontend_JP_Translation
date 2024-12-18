import {
  faPencil,
  faUserAstronaut,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/button';
import { InputCounter } from '../../components/input-counter';
import ButtonBoxComponent from '../../components/mentor-detail/button-box';
import SelectKeywords from '../../components/mentor-detail/select-keywords';
import TagInputBoxComponent from '../../components/mentor-detail/tag-input-box';
import { OneButtonModal } from '../../components/modal/one-button-modal/one-button-modal';
import { TwoButtonModal } from '../../components/modal/two-button-modal.tsx/two-button-modal';
import PageNationComponent from '../../components/page-nation';
import { axiosInstance } from '../../context/axios-interface';
import { getCookie, TOKEN_LIST } from '../../context/cookies';
import { appointmentsInterface } from '../../interface/mentor-detail/appointments.interface';
import { CommentProps } from '../../interface/mentor-detail/comment-props.interface';
import { mentorAvailableTimeInterface } from '../../interface/mentor-detail/mentor-available-time.interface';
import MentorDetailProps from '../../interface/mentor-detail/mentor-detail.interface';
import AuthStore, { User } from '../../states/auth/AuthStore';
import theme from '../../styles/theme';
import MarkdownRender from './markdownRender';
import ErrorStore, { ERROR_DEFAULT_VALUE } from '../../states/error/ErrorStore';
import MentorInfoModal, { ModalType } from '../signup/mentor-info-modal';
import MyTableComponents from '../../components/mentor-detail/my-table';
import NotFound from '../not-found/not-found';
import UserJoinStore from '../../states/user-join/UserJoinStore';
import { NowDateKr } from '../../states/date-kr';
import defaultProfile from '../../assets/image/defaultProfileImage.png';

function MentorDetail() {
  const [mentorIntroduction, setMentorIntroduction] = useState<string>('');
  const [mentor, setMentor] = useState<MentorDetailProps | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isActiveMentorDetail, setIsActiveMentorDetail] =
    useState<boolean>(false);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [appointments, setAppointments] = useState<appointmentsInterface[]>([]);
  const [isActivateIntroductionEdit, setIsActivateIntroductionEdit] =
    useState<boolean>(false);
  const [inputComment, setInputComment] = useState<string>('');
  const [mentorTags, setMentorTags] = useState<string[]>([]);
  const [isActivateMentorMarkdownEdit, setIsActivateMentorMarkdownEdit] =
    useState<boolean>(false);
  const [mentorMarkdown, setMentorMarkdown] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [take] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [isActivateDeleteModal, setIsActivateDeleteModal] =
    useState<boolean>(false);
  const [isActivateCommentSubmit, setIsActivateCommentSubmit] =
    useState<boolean>(false);
  const [isActivateApplyModal, setIsActivateApplyModal] =
    useState<boolean>(false);
  const [userCommentId, setUserCommentId] = useState<string>('');
  const [isActivateCommentDeleteModal, setIsActivateCommentDeleteModal] =
    useState<boolean>(false);
  const [isActivateMentorTimeEditModal, setIsActivateMentorTimeEditModal] =
    useState<boolean>(false);
  const [
    isActivateMentorMarkDownEditModal,
    setIsActivateMentorMarkDownEditModal,
  ] = useState<boolean>(false);
  const [isActivateMentorTimeModal, setIsActivateMentorTimeModal] =
    useState<boolean>(false);

  const setMentorAvailableTimeData = async (metorAvailableTimeData: string) => {
    const mentorAvailableTimeDataToArray = JSON.parse(metorAvailableTimeData);
    const appointmentsData: appointmentsInterface[] = [];
    const today = NowDateKr();
    const todayDay = today.getDay();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    mentorAvailableTimeDataToArray?.forEach(
      (data: mentorAvailableTimeInterface[], index: number) => {
        if (data?.length !== 0) {
          data.forEach(data2 => {
            const start = new Date(
              todayYear,
              todayMonth,
              todayDate + (index - todayDay),
              data2.startHour,
              data2.startMinute,
            );
            const end = new Date(
              todayYear,
              todayMonth,
              todayDate + (index - todayDay),
              data2.endHour,
              data2.endMinute,
            );

            appointmentsData.push({ start, end });
          });
        }
      },
    );
    setAppointments(appointmentsData);
  };

  const getParams = useParams();
  useEffect(() => {
    const params = {
      page: page,
      take: take,
    };
    const user: User = {
      intraId: AuthStore.getUserIntraId(),
      role: AuthStore.getUserRole(),
      join: AuthStore.getUserJoin(),
    };
    axiosInstance
      .get(`/mentors/${getParams.intraId}`)
      .then(result => {
        if (
          user.join !== 'true' &&
          user.role === 'mentor' &&
          user.intraId === result.data?.intraId
        ) {
          UserJoinStore.on();
        }
        setMentor(result.data);
        setMentorTags(result.data?.tags ? result.data.tags : []);
        setMentorIntroduction(
          result.data?.introduction
            ? result.data.introduction
            : '紹介文がありません。',
        );
        setMentorMarkdown(
          result.data?.markdownContent
            ? result.data.markdownContent
            : result.data?.markdownContent,
        );
        if (result.data?.isActive) {
          setMentorAvailableTimeData(result.data?.availableTime);
        }
      })
      .catch(err => {
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
        setError(true);
      });
    axiosInstance
      .get(`/comments/${getParams.intraId}`, { params })
      .then(result => {
        setComments(result.data.comments);
        setMaxPage(Math.ceil(result.data.total / take));
      })
      .catch(err => {
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
      });

    setUser(user);
  }, []);

  const handleSubmitIntroductionTags = () => {
    const config = {
      headers: { Authorization: `bearer ${AuthStore.getAccessToken()}` },
    };
    const data = { introduction: mentorIntroduction, tags: mentorTags };
    axiosInstance
      .patch(`/mentors/${getParams.intraId}`, data, config)
      .then(() => {
        axiosInstance.get(`/mentors/${getParams.intraId}`).then(result => {
          setMentor(result.data);
          setMentorTags(result.data?.tags ? result.data.tags : []);
          setMentorIntroduction(
            result.data?.introduction
              ? result.data.introduction
              : result.data?.introduction,
          );
        });
      })
      .catch(err => {
        console.log(err);
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
      });
  };

  const handleSubmitIntroductionTagsNo = () => {
    axiosInstance
      .get(`/mentors/${getParams.intraId}`)
      .then(() => {
        axiosInstance.get(`/mentors/${getParams.intraId}`).then(result => {
          setMentor(result.data);
          setMentorTags(result.data?.tags ? result.data.tags : []);
          setMentorIntroduction(
            result.data?.introduction
              ? result.data.introduction
              : '"紹介文がありません"',
          );
        });
      })
      .catch(err => {
        console.log(err);
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
      });
  };

  const AddHashtag = mentorTags?.map(tag => {
    return <div>{tag.padStart(tag.length + 1, '#')}</div>;
  });

  const handleCommentSubmit = () => {
    if (inputComment !== '') {
      const params = {
        page: 1,
        take: page * take,
      };
      const accessToken = getCookie(TOKEN_LIST.ACCESS_TOKEN);
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const data = { content: inputComment };
      axiosInstance
        .post(`/comments/${getParams.intraId}`, data, config)
        .then(() => {
          axiosInstance
            .get(`/comments/${getParams.intraId}`, { params })
            .then(result => {
              setComments(result.data.comments);
              setMaxPage(Math.ceil(result.data.total / take));
            })
            .catch(err => {
              // ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
            });
          setInputComment('');
        });
    }
  };

  const handleSubmitMentorMarkdown = () => {
    const accessToken = getCookie(TOKEN_LIST.ACCESS_TOKEN);
    const config = {
      headers: { Authorization: `bearer ${accessToken}` },
    };
    const data = { markdownContent: mentorMarkdown };
    axiosInstance
      .patch(`/mentors/${getParams.intraId}`, data, config)
      .then(() => {
        axiosInstance.get(`/mentors/${getParams.intraId}`).then(result => {
          setMentor(result.data);
          setMentorTags(result.data.tags);
          setMentorIntroduction(
            result.data?.introduction
              ? result.data.introduction
              : result.data?.introduction,
          );
          setMentorMarkdown(
            result.data?.markdownContent
              ? result.data.markdownContent
              : result.data?.markdownContent,
          );
        });
      })
      .catch(err => {
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
      });
  };
  const handleSubmitMentorMarkdownNo = () => {
    axiosInstance
      .get(`/mentors/${getParams.intraId}`)
      .then(result => {
        setMentorMarkdown(
          result.data?.markdownContent
            ? result.data.markdownContent
            : result.data?.markdownContent,
        );
      })
      .catch(err => {
        ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
      });
  };

  const deleteComment = (commentId: any) => {
    const params = {
      page: 1,
      take: take * page,
    };
    const accessToken = getCookie(TOKEN_LIST.ACCESS_TOKEN);
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    axiosInstance.delete(`/comments/${commentId}`, config).then(() => {
      axiosInstance
        .get(`/comments/${getParams.intraId}`, { params })
        .then(result => {
          setComments(result.data.comments);
          setMaxPage(Math.ceil(result.data.total / take));
        });
    });
  };

  return (
    <MentorDetailTag>
      {error ? (
        <>
          <NotFound />
        </>
      ) : (
        <>
          <MentorHeader>
            <MentorInfo>
              <MentorImage
                src={
                  mentor?.profileImage ? mentor?.profileImage : defaultProfile
                }
              />
              <MentorInfoContent>
                <MentorName>
                  <div className="mentor-name">{mentor?.name}</div>
                  <div className="mentor-intra">{mentor?.slackId}</div>
                  {user?.intraId === mentor?.intraId && user && mentor ? (
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="icon"
                      size="lg"
                      onClick={() => {
                        setIsActivateMentorTimeEditModal(
                          !isActivateMentorTimeEditModal,
                        );
                      }}
                    />
                  ) : null}
                </MentorName>
                <MentorActivateContainer>
                  <Button
                    fontFrame={theme.fontFrame.subTitleSmall}
                    borderWidth="1px"
                    text={`メンタリング ${mentor?.isActive ? '可' : '不可'}`}
                    backgroundColor={theme.colors.polarBackground}
                    color={theme.colors.polarSimpleMain}
                    width="12rem"
                    height="2.5rem"
                    borderRadius="20px"
                    isUnActivated={true}
                  />

                  {isActivateMentorTimeEditModal && (
                    <MentorInfoModal
                      intraId={getParams.intraId || ''}
                      modalType={ModalType.MENTOR_INFO}
                      setter={setIsActivateMentorTimeEditModal}
                      value={isActivateMentorTimeEditModal}
                    />
                  )}
                </MentorActivateContainer>
              </MentorInfoContent>
            </MentorInfo>
            {mentor?.isActive ? (
              <Link to={`/apply-page/${mentor?.intraId}`}>
                <Button
                  text="メンタリング申し込む"
                  width="21rem"
                  height="6rem"
                  backgroundColor={theme.colors.polarSimpleMain}
                  color={theme.colors.backgoundWhite}
                />
              </Link>
            ) : (
              <Button
                text="メンタリング申し込む"
                width="21rem"
                height="6rem"
                color={theme.colors.backgoundWhite}
                isUnActivated={true}
                onClick={() => {
                  setIsActivateApplyModal(!isActivateApplyModal);
                }}
              />
            )}
            {isActivateApplyModal && (
              <OneButtonModal
                Text={
                  user?.role !== 'cadet'
                    ? 'メンティのみ申し込みが可能です。'
                    : 'メンターが準備中です。'
                }
                TitleText="メンタリング申し込む"
                XButtonFunc={() => {
                  setIsActivateApplyModal(false);
                }}
                ButtonFunc={() => {
                  setIsActivateApplyModal(false);
                }}
                ButtonText="確認"
              />
            )}
          </MentorHeader>
          <MentorBody>
            <MentorBody1>
              <MentorBody1Left>
                <MenuBox>メンタリング利用方法</MenuBox>
                <MentorHowToContent>
                  <HowToContent>
                    <div>カデット</div>
                    <ol type="1">
                      <li>
                        メンターのメンタリング状態を確認し、メンタリング申請ボタンをクリック
                      </li>
                      <li>面会日程と情報を記入して提出</li>
                      <li>マイページで面会の状態を確認可能</li>
                      <li>
                        メンタリングが確定またはキャンセルされた場合、カデットに通知メールが送信されます
                      </li>
                      <li>場所を協議し、面会予定時間にメンタリングを実施</li>
                    </ol>
                  </HowToContent>
                  <HowToContent>
                    <div>メンター</div>
                    <ol>
                      <li>
                        カデットのメンタリング申請時に通知メールが送信されます
                      </li>
                      <li>マイページで面会の状態を決定可能</li>
                      <li>
                        メンタリングが確定またはキャンセルされた場合、カデットに通知メールが送信されます
                      </li>
                      <li>場所を協議し、面会予定時間にメンタリングを実施</li>
                      <li>メンタリング終了後にレポート作成が可能</li>
                    </ol>
                  </HowToContent>
                  <footer>
                    <div>
                      <FontAwesomeIcon icon={faUserAstronaut} />{' '}
                      48時間以内に面会の状態を確定またはキャンセルしない場合、自動的にキャンセルされます
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faUserAstronaut} />{' '}
                      申請時間の10分前にメンターが応答しない場合、自動的にキャンセルされます
                    </div>
                  </footer>
                </MentorHowToContent>
              </MentorBody1Left>
              <MentorBody1Right>
                <MentorBody1Right1>
                  <MenuBox>
                    メンター紹介
                    {user?.intraId === mentor?.intraId && user && mentor ? (
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="icon"
                        size="xs"
                        onClick={() => {
                          setIsActivateIntroductionEdit(
                            !isActivateIntroductionEdit,
                          );
                        }}
                      />
                    ) : null}
                  </MenuBox>
                  {isActivateIntroductionEdit ? (
                    <>
                      <InputCounter
                        value={mentorIntroduction}
                        setter={setMentorIntroduction}
                        countDisabled={false}
                        inputDisabled={false}
                        maxLength={150}
                        width={'100%'}
                        fontSize={theme.fontFrame.bodyMiddle}
                      />
                      <ButtonBoxComponent
                        items={mentorTags}
                        setter={setMentorTags}
                      />
                      <TagInputBoxComponent
                        setter={setMentorTags}
                        value={mentorTags}
                      />
                    </>
                  ) : (
                    <>
                      <MentorIntroduction>
                        {mentorIntroduction}
                      </MentorIntroduction>
                      <MentorTags>{AddHashtag}</MentorTags>
                    </>
                  )}
                  <SelectKeywords
                    isActivatedEdit={isActivateIntroductionEdit}
                    isActivateIntroductionEdit={isActivateIntroductionEdit}
                    setIsActivateDeleteModal={setIsActivateDeleteModal}
                    isActivateDeleteModal={isActivateDeleteModal}
                    setIsActivateIntroductionEdit={
                      setIsActivateIntroductionEdit
                    }
                    handleSubmitIntroductionTags={handleSubmitIntroductionTags}
                    handleSubmitIntroductionTagsNo={
                      handleSubmitIntroductionTagsNo
                    }
                  />
                </MentorBody1Right1>
                <MentorBody1Right2>
                  <MenuBox1>
                    <div>テーマ</div>
                    <div>状態</div>
                    <div>日付</div>
                  </MenuBox1>
                  <PageNationComponent />
                </MentorBody1Right2>
              </MentorBody1Right>
            </MentorBody1>
            <MentorBody2>
              <MenuBox3>
                <div>
                  可能 時刻
                  {user?.intraId === mentor?.intraId && user && mentor ? (
                    <FontAwesomeIcon
                      icon={faPencil}
                      size={'xs'}
                      className="icon"
                      onClick={() =>
                        setIsActivateMentorTimeModal(!isActivateMentorTimeModal)
                      }
                    />
                  ) : null}
                  {isActivateMentorTimeModal && (
                    <MentorInfoModal
                      intraId={getParams.intraId || ''}
                      modalType={ModalType.AVAILABLE_TIME}
                      setter={setIsActivateMentorTimeModal}
                      value={isActivateMentorTimeModal}
                    />
                  )}
                </div>
                {mentor?.updatedAt ? (
                  <div
                    style={{
                      color: `${theme.colors.fontGray}`,
                      marginBottom: '0.5rem',
                      paddingLeft: '0.3rem',
                      fontSize: '1rem',
                    }}
                  >
                    update: {mentor?.updatedAt?.substring(0, 10)}
                  </div>
                ) : (
                  <div
                    style={{
                      color: `${theme.colors.fontGray}`,
                      marginBottom: '0.5rem',
                      paddingLeft: '0.3rem',
                      fontSize: '1rem',
                    }}
                  >
                    create: {mentor?.createdAt?.substring(0, 10)}
                  </div>
                )}
              </MenuBox3>
              <MyTableComponents appointments={appointments} />
            </MentorBody2>
            <MentorBody3>
              <MentorBody3Toggle
                onClick={() => {
                  setIsActiveMentorDetail(data => !data);
                }}
              ></MentorBody3Toggle>

              <MenuBox>
                メンター情報
                {user?.intraId === mentor?.intraId && user && mentor ? (
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="icon"
                    size="xs"
                    onClick={() => {
                      setIsActivateMentorMarkdownEdit(
                        !isActivateMentorMarkdownEdit,
                      );
                    }}
                  />
                ) : null}
              </MenuBox>

              {isActivateMentorMarkdownEdit ? (
                <>
                  <InputCounter
                    value={mentorMarkdown}
                    setter={setMentorMarkdown}
                    countDisabled={false}
                    inputDisabled={false}
                    maxLength={10000}
                    width={'100%'}
                    height={'50rem'}
                    fontSize={theme.fontFrame.bodyMiddle}
                  />
                  <SubmitButton>
                    <Button
                      text="編集完了"
                      width="12rem"
                      height="3.5rem"
                      backgroundColor={theme.colors.polarSimpleMain}
                      borderRadius="20px"
                      onClick={() => {
                        setIsActivateMentorMarkDownEditModal(data => !data);
                      }}
                    />
                    {isActivateMentorMarkDownEditModal && (
                      <TwoButtonModal
                        Text="修正しますか？"
                        TitleText="修正"
                        XButtonFunc={() => {
                          setIsActivateMentorMarkDownEditModal(false);
                        }}
                        Button1Func={() => {
                          try {
                            handleSubmitMentorMarkdown();
                          } catch (err) {
                            // ErrorStore.on(err, ERROR_DEFAULT_VALUE.TITLE);
                          }
                          setIsActivateMentorMarkDownEditModal(false);
                          setIsActivateMentorMarkdownEdit(false);
                        }}
                        Button2Func={() => {
                          setIsActivateMentorMarkDownEditModal(false);
                          setIsActivateMentorMarkdownEdit(false);
                          handleSubmitMentorMarkdownNo();
                        }}
                        Button1Text="はい"
                        Button2Text="いいえ"
                        Button2bg={theme.colors.grayThree}
                      />
                    )}
                  </SubmitButton>
                </>
              ) : (
                <MarkdownContainer>
                  <MarkdownRender markDown={mentorMarkdown} />
                </MarkdownContainer>
              )}
            </MentorBody3>
            <MentorCommets>
              <MenuBox>コメント</MenuBox>
              {user?.intraId ? (
                <ReplyContainer>
                  <Comment>
                    <InputCounter
                      value={inputComment}
                      setter={setInputComment}
                      countDisabled={true}
                      inputDisabled={false}
                      maxLength={300}
                      width={'100%'}
                      height={'6rem'}
                    />
                    <SubmitButton>
                      <Button
                        text="提出"
                        width="9rem"
                        height="100%"
                        backgroundColor={
                          inputComment.length
                            ? theme.colors.polarSimpleMain
                            : theme.colors.grayThree
                        }
                        borderRadius="10px"
                        onClick={() => {
                          user.role === 'cadet'
                            ? handleCommentSubmit()
                            : setIsActivateCommentSubmit(data => !data);
                        }}
                        isUnActivated={inputComment.length === 0}
                      />
                      {isActivateCommentSubmit && (
                        <OneButtonModal
                          TitleText="コメントの作成"
                          Text="コメントはカデットのみ作成できます。"
                          XButtonFunc={() => {
                            setIsActivateCommentSubmit(false);
                          }}
                          ButtonFunc={() => {
                            setIsActivateCommentSubmit(false);
                          }}
                          ButtonText="確認"
                        />
                      )}
                    </SubmitButton>
                  </Comment>
                </ReplyContainer>
              ) : null}
              <MentorCommetsContent>
                {isActivateCommentDeleteModal && (
                  <TwoButtonModal
                    TitleText="コメント削除"
                    Text="本当にコメントを削除しますか？"
                    XButtonFunc={() => {
                      setIsActivateCommentDeleteModal(false);
                    }}
                    Button1Func={() => {
                      setIsActivateCommentDeleteModal(false);
                      deleteComment(userCommentId);
                    }}
                    Button1Text="はい"
                    Button2Func={() => {
                      setIsActivateCommentDeleteModal(false);
                    }}
                    Button2Text="いいえ"
                    Button2bg={theme.colors.grayThree}
                  />
                )}
                {comments?.map((comment: CommentProps) => {
                  return (
                    <Comment>
                      <img src={comment?.cadets?.profileImage} />
                      <UserContent>
                        <div>
                          <div className="cadetName">
                            {comment?.cadets?.intraId}
                          </div>
                          {mentor?.updatedAt ? (
                            <div className="updatedAt">{`${mentor?.updatedAt.substring(
                              0,
                              4,
                            )}.${mentor?.updatedAt.substring(
                              5,
                              7,
                            )}.${mentor?.updatedAt.substring(8, 10)}`}</div>
                          ) : null}
                          {user?.intraId === comment?.cadets?.intraId &&
                          user ? (
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="icon"
                              color={'red'}
                              onClick={() => {
                                setUserCommentId(comment.id);
                                setIsActivateCommentDeleteModal(data => !data);
                              }}
                            />
                          ) : null}
                        </div>
                        <div>{comment?.content}</div>
                      </UserContent>
                    </Comment>
                  );
                })}
                {maxPage <= page ? null : (
                  <CommentPageNation
                    onClick={() => {
                      const params = {
                        page: page + 1,
                        take: take,
                      };
                      axiosInstance
                        .get(`/comments/${getParams.intraId}`, { params })
                        .then(response => {
                          if (response.data.comments !== 0) {
                            setComments([
                              ...comments,
                              ...response.data.comments,
                            ]);
                          }
                          setMaxPage(Math.ceil(response.data.total / take));
                          if (response.data.total > page * take) {
                            setPage(page + 1);
                          }
                        })
                        .catch(error => {
                          console.log(error);
                        });
                    }}
                  >
                    コメント詳細
                  </CommentPageNation>
                )}
              </MentorCommetsContent>
            </MentorCommets>
          </MentorBody>
        </>
      )}
    </MentorDetailTag>
  );
}

const MarkdownContainer = styled.div`
  padding-left: 2rem;
`;

const MentorActivateContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  .icon {
    margin-left: 1rem;
    cursor: pointer;
  }
`;

const ReplyContainer = styled.div`
  border-bottom: 1px solid ${theme.colors.polarSimpleMain};
`;

const CommentPageNation = styled.div`
  cursor: pointer;
`;

const MenuBox3 = styled.div`
  border-top: 2px solid ${props => props.theme.colors.blackThree};
  border-bottom: 1px solid ${props => props.theme.colors.grayFive};
  width: 100%;
  box-sizing: border-box;
  padding-left: 1rem;
  padding-top: 1.3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  ${theme.fontFrame.titleSmall};
  font-weight: 900;
  letter-spacing: 0.1rem;
  margin-bottom: 1.3rem;
  .icon {
    margin-left: 0.5rem;
    cursor: pointer;
  }
  padding-bottom: 0.5rem;
`;

const HowToContent = styled.div`
  margin: 0 1.5rem;
  color: ${theme.colors.grayOne};
`;
const UserContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 1.5rem;
  .inputCommentName {
    font-weight: 900;
    margin-right: 1rem;
  }
  div:first-child {
    display: flex;
    text-align: end;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
    .updatedAt {
      font-size: 1rem;
      padding-left: 0.7rem;
      color: ${props => props.theme.colors.grayThree};
      font-weight: normal;
      margin-top: 0.1rem;
    }
    .icon {
      margin-left: 1rem;
      cursor: pointer;
    }
  }
  div:last-child {
    ${props => props.theme.fontFrame.subTitleMiddle};
    font-weight: normal;
  }
`;

const Comment = styled.div`
  display: flex;
  margin: 2rem;
  position: relative;
  img {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
  }
`;

const MentorCommetsContent = styled.div``;

const SubmitButton = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

const MentorCommets = styled.div`
  margin-top: 5%;
`;

const MentorBody3Toggle = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-left: 1rem;
  cursor: pointer;
  div {
    ${theme.fontFrame.subTitleMiddle};
    margin-left: 1rem;
  }
  margin-bottom: 5%;
`;

const MentorBody3 = styled.div`
  margin-top: 10%;
`;

const MentorBody2 = styled.div`
  margin-top: 10%;
`;

const MenuBox1 = styled.div`
  border-top: 2px solid ${props => props.theme.colors.blackThree};
  border-bottom: 1px solid ${props => props.theme.colors.grayFive};
  width: 100%;
  height: 3rem;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
  font-weight: 700;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const MentorBody1Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const MentorBody1Right2 = styled.div`
  display: flex;
  flex-direction: column;
`;

const MentorTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${theme.colors.polarSimpleMain};
  ${theme.fontFrame.bodyMiddle};
  div {
    margin-right: 0.5rem;
  }
`;

const MentorIntroduction = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  word-break: break-all;
  margin: 1.3rem;
  ${theme.fontFrame.bodyMiddle};
  color: ${theme.colors.blackThree};
  font-weight: 900;
  word-spacing: 0.1rem;
  white-space: pre-wrap;
`;

const MentorBody1Right1 = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10%;
`;

const MentorBody1 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  grid-column-gap: 3rem;
  ${theme.fontSize.sizeSmall};
`;

const MentorHowToContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  ${theme.fontFrame.bodySmall}

  ol {
    margin-top: 0.5rem;
    padding-left: 3rem;
    margin-bottom: 2rem;
  }
  li {
    margin-bottom: 0.5rem;
    color: ${theme.colors.grayTwo};
    letter-spacing: 0.1rem;
    padding-top: 0.5rem;
    margin-left: 1rem;
  }
  footer {
    color: ${theme.colors.polarSimpleMain};
    font-size: 1.3rem;
    display: flex;
    flex-direction: column;
    margin-left: 4rem;
  }
`;

const MentorBody1Left = styled.div`
  margin-bottom: 10%;
`;

const MentorHeader = styled.div`
  display: flex;
  width: 100%;
  height: 27rem;
  background-color: ${props => props.theme.colors.polarBackground};
  justify-content: space-around;
  align-items: center;
`;

const MentorImage = styled.img`
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  margin-right: 2rem;

  @media screen and (max-width: 700px) {
    width: 13rem;
    height: 13rem;
  }
`;

const MentorInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const MentorInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.6rem;
  word-break: break-word;
  align-items: center;
`;
const MentorName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .mentor-name {
    ${theme.fontFrame.titleLarge};
    ${theme.font.inter};
    font-weight: 900;
    @media screen and (max-width: 700px) {
      margin-top: 1rem;
      ${theme.fontFrame.titleMedium};
    }
    @media screen and (max-width: 600px) {
      margin-top: 1rem;
      ${theme.fontFrame.titleSmall};
    }
  }
  .mentor-intra {
    margin-left: 1rem;
    ${theme.fontFrame.titleSmall};
    @media screen and (max-width: 600px) {
      ${theme.fontFrame.subTitleSmall};
    }
    @media screen and (max-width: 450px) {
      ${theme.fontFrame.bodySmall};
    }
  }
  .icon {
    margin-left: 0.5rem;
    cursor: pointer;
  }
  margin-bottom: 0.5rem;
`;

const MentorBody = styled.div`
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 5%;
`;

const MenuBox = styled.div`
  border-top: 2px solid ${props => props.theme.colors.blackThree};
  border-bottom: 1px solid ${props => props.theme.colors.grayFive};
  width: 100%;
  box-sizing: border-box;
  padding-left: 1rem;
  padding-top: 1.3rem;
  display: flex;
  text-align: center;
  justify-content: flex-start;
  align-items: center;
  ${theme.fontFrame.titleSmall};
  font-weight: 900;
  letter-spacing: 0.1rem;
  margin-bottom: 1.3rem;
  padding-bottom: 0.5rem;
`;
const MentorDetailTag = styled.div`
  ${theme.font.nanumGothic};
  background-color: ${theme.colors.backgoundWhite};
  .icon {
    margin-left: 0.5rem;
    cursor: pointer;
  }
`;

export default MentorDetail;
