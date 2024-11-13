import SelectList from './selectList';
import deleteButtonImage from '../../assets/signup/deleteButton.png';
import {
  BodyBigFont,
  DeleteButtonImage,
  TimeTableContainer,
} from '../../containers/signup/signup-style';

const days: string[] = ['日', '月', '火', '水', '木', '金', '土'];

const hours: string[] = [
  '00時',
  '01時',
  '02時',
  '03時',
  '04時',
  '05時',
  '06時',
  '07時',
  '08時',
  '09時',
  '10時',
  '11時',
  '12時',
  '13時',
  '14時',
  '15時',
  '16時',
  '17時',
  '18時',
  '19時',
  '20時',
  '21時',
  '22時',
  '23時',
];

const minutes: string[] = ['00分', '30分'];

interface ColumnsProps {
  id: number;
  date: number[];
  onRemove: (id: number) => void;
  onChange: (id: number, index: number, value: number) => void;
}

function Columns(props: ColumnsProps) {
  const boxWidth = 75;

  return (
    <TimeTableContainer>
      <SelectList
        lists={days}
        width={boxWidth}
        value={props.date[0]}
        id={props.id}
        index={0}
        onChange={props.onChange}
      ></SelectList>
      <SelectList
        lists={hours}
        width={boxWidth}
        value={props.date[1]}
        id={props.id}
        index={1}
        onChange={props.onChange}
      ></SelectList>
      <SelectList
        lists={minutes}
        width={boxWidth}
        value={props.date[2]}
        id={props.id}
        index={2}
        onChange={props.onChange}
      ></SelectList>
      <BodyBigFont style={{ paddingLeft: '0.6rem', marginTop: '10px' }}>
        ~
      </BodyBigFont>
      <SelectList
        lists={hours}
        width={boxWidth}
        value={props.date[3]}
        id={props.id}
        index={3}
        onChange={props.onChange}
      ></SelectList>
      <SelectList
        lists={minutes}
        width={boxWidth}
        value={props.date[4]}
        id={props.id}
        index={4}
        onChange={props.onChange}
      ></SelectList>
      <DeleteButtonImage
        src={deleteButtonImage}
        alt="delete-button-image"
        onClick={() => props.onRemove(props.id)}
      />
    </TimeTableContainer>
  );
}

export default Columns;
