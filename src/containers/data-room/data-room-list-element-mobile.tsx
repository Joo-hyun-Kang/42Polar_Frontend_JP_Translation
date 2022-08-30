import CheckBox from '../../components/check-box';
import { dataRoomProps } from '../../interface/data-room/data-room-props.interface';
import { mentoringIds } from '../../interface/data-room/mentoring-ids.interface';
import { TableData, Link, refineMeetingAt } from './data-room-list-element';

function DataRoomListElementMobile(
  data: dataRoomProps,
  index: number,
  buttonClickToggle: (status: boolean, ids: mentoringIds) => void,
  selectedList: mentoringIds[],
) {
  return (
    <tr>
      <TableData>
        {data.id && (
          <CheckBox
            key={index}
            onChange={e => {
              buttonClickToggle(e.target.checked, {
                reportId: data.id,
                mentoringLogId: data.mentoringLogs.id,
              });
            }}
            checked={
              selectedList.findIndex(list => list.reportId === data.id) !== -1
                ? true
                : false
            }
          ></CheckBox>
        )}
      </TableData>
      <TableData>{data.mentors?.name ?? ''}</TableData>
      <TableData>{data.mentors?.intraId ?? ''}</TableData>
      <TableData>{data.cadets?.name ?? ''}</TableData>
      <TableData>{data.cadets?.intraId ?? ''}</TableData>
      <TableData>
        {data.cadets ? (data.cadets?.isCommon ? '공통' : '심화') : ''}
      </TableData>
      {data.mentoringLogs?.meetingAt[0] ? (
        refineMeetingAt(data.mentoringLogs.meetingAt)
      ) : (
        <TableData></TableData>
      )}
      <TableData>{data.money?.toLocaleString('ko-KR') ?? ''}</TableData>
      <TableData>
        <Link
          href={'https://www.42polar.kr/report-details/' + data.id}
          //FIX ME: 연결 제대로 안됨, 수정 필요
        >
          {data.id ? '상세보기' : ''}
        </Link>
      </TableData>
    </tr>
  );
}

export default DataRoomListElementMobile;
