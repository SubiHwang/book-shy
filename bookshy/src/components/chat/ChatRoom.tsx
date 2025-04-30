import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../types/chat.d.ts';
// import ChatRoomHeader from './ChatRoomHeader.tsx';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
// import { useNavigate } from 'react-router-dom';
// import socket from '../../socket/socket.ts';
import { io } from 'socket.io-client';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
}

const socket = io('http://localhost:4000');

function ChatRoom({ partnerName, partnerProfileImage, initialMessages }: Props) {
  // const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isNewRoom = initialMessages.length === 0;

  useEffect(() => {
    socket.on('receiveMessage', (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    if (isNewRoom) {
      const now = new Date();
      const noticeMessage: ChatMessage = {
        id: 'notice-' + Date.now(),
        senderId: 'system',
        content:
          '거래 시 주의해주세요!\n도서 교환은 공공장소에서 진행하고, 책 상태를 미리 확인하세요.\n과도한 개인정보 요청이나 외부 연락 유도는 주의하세요.\n도서 상호 대여 서비스 사용 시 반납 기한을 꼭 지켜주세요!\n안전하고 즐거운 독서 문화 함께 만들어가요!',
        timestamp: now.toISOString(),
      };
      setMessages((prev) => [noticeMessage, ...prev]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showOptions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string) => {
    const now = new Date();
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      senderId: 'me',
      content,
      timestamp: now.toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit('sendMessage', newMessage);
  };

  const handleBack = () => {
    // navigate('/');
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const formatDateLabel = (isoTimestamp: string) => {
    const date = new Date(isoTimestamp);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        });
  };

  const formatTime = (isoTimestamp: string) => {
    const date = new Date(isoTimestamp);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  let lastDateLabel = '';

  return (
    <div className="flex flex-col h-screen">
      {/* <ChatRoomHeader partnerName={partnerName} partnerProfileImage={partnerProfileImage} onBack={handleBack} /> */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-2">
        {messages.map((msg, index) => {
          const dateLabel = formatDateLabel(msg.timestamp);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <>
                  <div className="text-center my-2 text-gray-500 text-xs">{dateLabel}</div>
                  {msg.senderId === 'system' && (
                    <ChatMessageItem message={msg} isMyMessage={false} />
                  )}
                </>
              )}
              {msg.senderId !== 'system' && (
                <ChatMessageItem
                  message={{ ...msg, timestamp: formatTime(msg.timestamp) }}
                  isMyMessage={msg.senderId === 'me'}
                />
              )}
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={handleSendMessage}
        showOptions={showOptions}
        onToggleOptions={toggleOptions}
      />
    </div>
  );
}

export default ChatRoom;
