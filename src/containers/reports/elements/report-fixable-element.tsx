import styled from '@emotion/styled';
import { ReportElementRoot, Topic } from './element-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import defaultTheme from '../../../styles/theme';
import ReportStore from '../../../states/repoort/ReportStore';
import { REPORT_STATE } from '../report-form';

const FixableElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 60%;
`;

const Content = styled.div`
  ${defaultTheme.font.nanumGothic};
  ${defaultTheme.fontSize.sizeExtraSmall};
  text-align: left;
  width: 100%;
`;

const FixableIcon = styled.div`
  display: flex;
  margin: 0px 5px;
  &:hover {
    color: gray;
  }
`;

const EditContentInput = styled.input`
  width: 100%;
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  vertical-align: top;
  resize: none;
  &:focus {
    outline: none;
  }
`;

export interface ReportFixableElementProps {
  topic: string;
  content: string | undefined;
}

export function ReportFixableElement(props: ReportFixableElementProps) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <ReportElementRoot>
      <Topic>{props.topic}</Topic>
      <FixableElement>
        {isEdit ? (
          <>
            <EditContentInput
              onChange={e => {
                ReportStore.setPlace(e.target.value);
              }}
              value={props.content || ''}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setIsEdit(false);
                }
              }}
            />
            <FixableIcon
              onClick={() => {
                setIsEdit(false);
              }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </FixableIcon>
          </>
        ) : (
          <>
            <Content>{props.content ? props.content : '(입력 필요)'}</Content>
            {ReportStore.report.status ===
            REPORT_STATE.EDIT_IMPOSSIBLE ? null : (
              <FixableIcon
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
              </FixableIcon>
            )}
          </>
        )}
      </FixableElement>
    </ReportElementRoot>
  );
}
