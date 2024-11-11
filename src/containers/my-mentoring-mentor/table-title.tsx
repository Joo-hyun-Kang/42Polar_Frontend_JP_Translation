import styled from '@emotion/styled';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { InfomationModal } from '../../components/modal/infomation-modal/infomation-modal';
import defaultTheme from '../../styles/theme';

const TableColumnLine = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid black;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  height: 50px;
  font-weight: bold;
  ${defaultTheme.fontSize.sizeExtraSmall};
  ${defaultTheme.font.nanumGothic};
  @media screen and (max-width: 800px) {
    ${defaultTheme.fontSize.sizeSmall};
  }
  @media screen and (max-width: 700px) {
    font-size: 1rem;
  }
`;

const TableColumnDate = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
`;

const TableColumnUser = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
`;

const TableColumnTopic = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
  align-items: center;
`;

const TableColumnTime = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
  align-items: center;
`;

const TableColumnState = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
`;

const TableColumnReport = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.2);
`;

const timeInfoText =
  '開始時間とメンタリングの進行時間が表示されます。\n\n⚠️ 現在の方針により、メンタリング料金は時間単位で（分は切り捨て計算）算定されます。';
const statusInfoText =
  '待機中: メンターに届いたカデットのメンタリング申請を確認し、承諾または拒否することができます。\n\n⚠️ 48時間以内に承諾しない場合、自動的にキャンセルされます。\n\n⚠️ 選択可能な時間が存在しない場合も自動キャンセルされます。\n\n確定: メンタリングが確定した状態で、やむを得ずメンタリングを行えない場合はキャンセルするか、メンタリング終了後に完了することができます。\n\n完了: メンタリング開始時間が経過した後、トピックをクリックして変更できます。';
const reportInfoText =
  '作成不可: メンタリングの状態が完了ではない場合です。完了はメンタリング開始時間後にトピックをクリックして変更できます。\n\n作成必要: メンタリングが完了したため、レポートの作成、下書き保存、および提出が可能です。\n\n作成中: 下書き保存されたレポートを確認・修正して提出できます。\n\n作成完了: レポートを提出すると、それ以上の修正はできない作成完了状態になります。';

export function TableTitle() {
  const [modal, setModal] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  return (
    <TableColumnLine>
      {modal && (
        <InfomationModal
          TitleText={'🌟 42Polar 案内'}
          Text={text}
          ButtonText={'閉じる'}
          ButtonBg={defaultTheme.colors.polarSimpleMain}
          ButtonFunc={() => {
            setText('');
            setModal(false);
          }}
        />
      )}
      <TableColumnDate>申請 日時</TableColumnDate>
      <TableColumnUser>申請 カデット</TableColumnUser>
      <TableColumnTopic>テーマ</TableColumnTopic>
      <TableColumnTime>
        お出合いする時刻
        <IconWrapper
          onClick={() => {
            setText(timeInfoText);
            setModal(true);
          }}
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="icon" />
        </IconWrapper>
      </TableColumnTime>
      <TableColumnState>
        状態
        <IconWrapper
          onClick={() => {
            setText(statusInfoText);
            setModal(true);
          }}
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="icon" />
        </IconWrapper>
      </TableColumnState>
      <TableColumnReport>
        報告書
        <IconWrapper
          onClick={() => {
            setText(reportInfoText);
            setModal(true);
          }}
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="icon" />
        </IconWrapper>
      </TableColumnReport>
    </TableColumnLine>
  );
}
