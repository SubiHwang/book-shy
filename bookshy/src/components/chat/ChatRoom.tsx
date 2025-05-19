import { ChatMessage } from '@/types/chat/chat';
import { useState } from 'react';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
  bookShyScore: number;
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
}

const DUMMY_MESSAGES = [
  '안녕하세요!',
  '채팅 레이아웃 테스트 중입니다.',
  '키보드 대응!',
  '더미 메시지 4',
  '더미 메시지 5',
  '더미 메시지 6',
  '더미 메시지 7',
  '더미 메시지 8',
  '더미 메시지 9',
  '더미 메시지 10',
  '안녕하세요!',
  '채팅 레이아웃 테스트 중입니다.',
  '키보드 대응!',
  '더미 메시지 4',
  '더미 메시지 5',
  '더미 메시지 6',
  '더미 메시지 7',
  '더미 메시지 8',
  '더미 메시지 9',
  '더미 메시지 10',
];

const ChatRoom = ({
  partnerName: _partnerName,
  partnerProfileImage: _partnerProfileImage,
  initialMessages: _initialMessages,
  bookShyScore: _bookShyScore,
  myBookId: _myBookId,
  myBookName: _myBookName,
  otherBookId: _otherBookId,
  otherBookName: _otherBookName,
}: Props) => {
  const [input, setInput] = useState('');

  return (
    <div className="relative bg-white pb-20 px-4 pt-4 min-h-screen">
      {/* 채팅창 (WishBooks처럼 자연스러운 flow, height/overflow 없음) */}
      <div className="mb-4">
        {DUMMY_MESSAGES.map((msg, i) => (
          <div key={i} className="mb-3 p-3 bg-gray-100 rounded-xl w-fit max-w-[70%]">
            {msg}
          </div>
        ))}
      </div>
      {/* 인풋 (WishBooks처럼 fixed) */}
      <div
        className="fixed bottom-0 left-0 w-full bg-white border-t flex items-center px-4 z-10"
        style={{ height: 56 }}
      >
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2 text-blue-500 font-bold">전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
