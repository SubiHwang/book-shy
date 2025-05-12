interface Props {
  profileImageUrl?: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

const MyTripEditor = ({ profileImageUrl, value, onChange, onSubmit }: Props) => (
  <div className="flex gap-2 items-start mt-4">
    <img src={profileImageUrl || '/avatars/me.png'} className="w-8 h-8 rounded-full" />
    <div className="flex-1">
      <textarea
        placeholder="0/1000"
        maxLength={1000}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white rounded-md shadow-sm px-3 py-2 text-sm resize-none"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button onClick={onSubmit} className="text-white bg-primary px-4 py-2 rounded-md text-sm">
          작성하기
        </button>
      </div>
    </div>
  </div>
);

export default MyTripEditor;
