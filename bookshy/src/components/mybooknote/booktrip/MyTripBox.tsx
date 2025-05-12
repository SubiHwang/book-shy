import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  trip: BookTripWithUser;
}

const MyTripBox = ({ trip }: Props) => (
  <div className="flex items-start justify-end gap-2">
    <div className="text-right">
      <p className="text-xs text-gray-500 mb-1">
        나의 한 마디 · {new Date(trip.createdAt).toLocaleString()}
      </p>
      <div className="bg-white px-4 py-2 rounded-md shadow-sm max-w-[80%] text-sm inline-block">
        {trip.content}
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <button className="text-xs text-gray-500 border px-2 py-1 rounded-md">삭제하기</button>
        <button className="text-xs text-white bg-primary px-2 py-1 rounded-md">수정하기</button>
      </div>
    </div>
  </div>
);

export default MyTripBox;
