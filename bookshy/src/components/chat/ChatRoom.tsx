import React, { useRef, useEffect, useState } from 'react';

const HEADER_HEIGHT = 64;
const INPUT_HEIGHT = 56;

const DUMMY_MESSAGES = [
  '안녕하세요!',
  '채팅 레이아웃 테스트 중입니다.',
  '이 레이아웃은 헤더, 채팅창, 인풋창 3개만 있습니다.',
  '모바일 키보드 대응 확인용입니다.',
  '더미 메시지 5',
  '더미 메시지 6',
  '더미 메시지 7',
  '더미 메시지 8',
  '더미 메시지 9',
  '더미 메시지 10',
  '안녕하세요!',
  '채팅 레이아웃 테스트 중입니다.',
  '이 레이아웃은 헤더, 채팅창, 인풋창 3개만 있습니다.',
  '모바일 키보드 대응 확인용입니다.',
  '더미 메시지 5',
  '더미 메시지 6',
  '더미 메시지 7',
  '더미 메시지 8',
  '더미 메시지 9',
  '더미 메시지 10',
];

const ChatRoom = () => {
  const [viewportHeight, setViewportHeight] = useState(
    window.visualViewport?.height || window.innerHeight,
  );
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };
    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return (
    <div
      className="flex flex-col bg-white"
      style={{ height: `${viewportHeight}px`, minHeight: '100dvh' }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full flex items-center justify-center bg-white border-b z-10"
        style={{ height: HEADER_HEIGHT }}
      >
        <span className="font-bold text-lg">채팅방 헤더</span>
      </header>

      {/* 채팅창 영역 */}
      <main
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-2"
        style={{
          marginTop: HEADER_HEIGHT,
          marginBottom: INPUT_HEIGHT,
          height: viewportHeight - HEADER_HEIGHT - INPUT_HEIGHT,
        }}
      >
        {DUMMY_MESSAGES.map((msg, i) => (
          <div key={i} className="mb-3 p-3 bg-gray-100 rounded-xl w-fit max-w-[70%]">
            {msg}
          </div>
        ))}
      </main>

      {/* 인풋창 */}
      <footer
        className="fixed bottom-0 left-0 w-full bg-white border-t flex items-center px-4 z-10"
        style={{ height: INPUT_HEIGHT }}
      >
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="메시지를 입력하세요"
        />
        <button className="ml-2 text-blue-500 font-bold">전송</button>
      </footer>
    </div>
  );
};

export default ChatRoom;
