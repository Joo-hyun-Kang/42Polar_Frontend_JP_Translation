import CheckBox from '../../components/check-box';
import { dataRoomProps } from '../../interface/data-room/data-room-props.interface';
import {
  TableData,
  CustomLink,
  refineMeetingAt,
} from './data-room-list-element';

function DataRoomListElementMobile(
  data: dataRoomProps,
  index: number,
  buttonClickToggle: (status: boolean, ids: string) => void,
  selectedList: string[],
) {
  return (
    <tr>
      <TableData>
        {data.id && (
          <CheckBox
            key={index}
            onChange={e => {
              buttonClickToggle(e.target.checked, data.id);
            }}
            checked={
              selectedList.findIndex(list => list === data.id) !== -1
                ? true
                : false
            }
          ></CheckBox>
        )}
      </TableData>
      <TableData>{data.mentors?.name ?? ''}</TableData>
      <TableData>{data.mentors?.intraId ?? ''}</TableData>
      <TableData>{data.cadets?.intraId ?? ''}</TableData>
      <TableData>
        {data.cadets ? (data.cadets?.isCommon ? '共通' : '深化') : ''}
      </TableData>
      {data.mentoringLogs?.meetingAt[0] ? (
        refineMeetingAt(data.mentoringLogs.meetingAt)
      ) : (
        <TableData></TableData>
      )}
      <TableData>{data.money?.toLocaleString('ko-KR') ?? ''}</TableData>
      <TableData>
        <CustomLink to={'/report-detail?reportId=' + data.id}>
          {data.id ? '詳細表示' : ''}
        </CustomLink>
      </TableData>
      <TableData>{data.status ?? ''}</TableData>
    </tr>
  );
}

export default DataRoomListElementMobile;
