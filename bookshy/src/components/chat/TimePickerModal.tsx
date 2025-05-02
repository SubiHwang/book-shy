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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[320px] p-4 shadow-md">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose}>
            <X size={20} />
          </button>
          <h2 className="text-sm font-semibold text-center flex-1 -ml-4">시간 선택</h2>
        </div>

        {/* 오전/오후 */}
        <div className="flex justify-center gap-2 mb-4">
          {['오전', '오후'].map((type) => (
            <button
              key={type}
              onClick={() => setMeridiem(type as '오전' | '오후')}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                meridiem === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 시:분 선택 */}
        <div className="flex justify-center items-center gap-2 text-primary font-bold text-lg mb-4">
          <select
            className="bg-transparent appearance-none"
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
            className="bg-transparent appearance-none"
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
        <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm">
          {quickSelects.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => {
                setMeridiem(value[0] as '오전' | '오후');
                setHour(value[1]);
                setMinute(value[2]);
              }}
              className="px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          className="w-full bg-primary text-white py-2 rounded-full text-sm font-semibold"
        >
          ✔ 선택 완료
        </button>
      </div>
    </div>
  );
};

export default TimePickerModal;
