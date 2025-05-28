interface GenderSelectorProps {
  gender: 'M' | 'F' | '';
  onChange: (v: 'M' | 'F') => void;
}

const GenderSelector = ({ gender, onChange }: GenderSelectorProps) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">성별</label>
    <div className="flex gap-6">
      <label className="flex items-center gap-1">
        <input type="radio" value="F" checked={gender === 'F'} onChange={() => onChange('F')} />
        여성
      </label>
      <label className="flex items-center gap-1">
        <input type="radio" value="M" checked={gender === 'M'} onChange={() => onChange('M')} />
        남성
      </label>
    </div>
  </div>
);

export default GenderSelector;
