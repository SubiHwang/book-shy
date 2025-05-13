import { FC, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const TimePickerModal: FC<Props> = ({ onClose, onConfirm }) => {
  const [meridiem, setMeridiem] = useState<'오전' | '오후'>('오전');
  const [hour, setHour] = useState('01');
  const [minute, setMinute] = useState('00');

  const quickSelects = [
    { label: '오전 9시', value: ['오전', '09', '00'] },
    { label: '오후 12시', value: ['오후', '12', '00'] },
    { label: '오후 3시', value: ['오후', '03', '00'] },
    { label: '오후 6시', value: ['오후', '06', '00'] },
  ];

  const handleComplete = () => {
    onConfirm(`${meridiem} ${hour}시 ${minute}분`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
      <div className="bg-light-bg-card rounded-2xl w-[90%] max-w-sm p-5 shadow-md">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-5">
          <button onClick={onClose} className="text-light-text-muted hover:text-light-text">
            <X size={20} />
          </button>
          <h2 className="flex-1 text-center text-sm font-semibold text-light-text -ml-5">
            시간 선택
          </h2>
        </div>

        {/* 오전/오후 선택 */}
        <div className="flex justify-center gap-3 mb-5">
          {['오전', '오후'].map((type) => (
            <button
              key={type}
              onClick={() => setMeridiem(type as '오전' | '오후')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                meridiem === type
                  ? 'bg-primary text-white'
                  : 'bg-light-bg-shade text-light-text-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 시:분 선택 */}
        <div className="flex justify-center items-center gap-2 font-bold text-lg text-primary mb-5">
          <select
            className="appearance-none bg-transparent text-sm px-2 py-1 outline-none"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          :
          <select
            className="appearance-none bg-transparent text-sm px-2 py-1 outline-none"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          >
            {['00', '15', '30', '45'].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 text-sm">
          {quickSelects.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => {
                setMeridiem(value[0] as '오전' | '오후');
                setHour(value[1]);
                setMinute(value[2]);
              }}
              className="px-3 py-1 rounded-full border border-primary text-primary active:scale-95 transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          className="w-full bg-primary text-white py-2 rounded-full text-sm font-semibold active:scale-95 transition"
        >
          ✔ 선택 완료
        </button>
      </div>
    </div>
  );
};

export default TimePickerModal;
