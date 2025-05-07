import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/chat/chat.ts';
import { useStomp } from '@/hooks/chat/useStomp.ts';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
}

function ChatRoom({ partnerName, partnerProfileImage }: Props) {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const { data: initialMessages = [] } = useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => fetchMessages(Number(chatRoomId)),
    enabled: !!chatRoomId,
    retry: false,
  });

  useEffect(() => {
    if (messages.length > 0) return;

    if (initialMessages.length === 0) {
      const now = new Date();
      const noticeMessage: ChatMessage = {
        id: 'notice-' + Date.now(),
        senderId: 'system',
        content:
          '도서 교환은 공공장소에서 진행하고, 책 상태를 미리 확인하세요.\n과도한 개인정보 요청이나 외부 연락 유도는 주의하세요.\n도서 상호 대여 서비스 사용 시 반납 기한을 꼭 지켜주세요!\n안전하고 즐거운 독서 문화 함께 만들어가요!',
        timestamp: now.toISOString(),
        type: 'notice',
      };
      setMessages([noticeMessage]);
    } else {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const { sendMessage } = useStomp(Number(chatRoomId), (newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages, showOptions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string) => {
    if (!chatRoomId) return;
    sendMessage(Number(chatRoomId), 1, content); // 나중에 senderId인 1은 로그인 한 ID로 교체
  };

  const handleSendSystemMessage = (
    content: string,
    type: 'notice' | 'info' | 'warning' = 'info',
  ) => {
    const now = new Date();
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      senderId: 'system',
      content,
      timestamp: now.toISOString(),
      type,
    };
    setMessages((prev) => [...prev, newMessage]);
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
      <ChatRoomHeader partnerName={partnerName} partnerProfileImage={partnerProfileImage} />
      <div className="flex-1 overflow-y-auto bg-[#FFFCF9] px-3 py-2">
        {messages.map((msg, index) => {
          const dateLabel = formatDateLabel(msg.timestamp);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          const isSystem = msg.senderId === 'system';

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center gap-2 text-xs text-gray-400 my-4">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="px-2 whitespace-nowrap">{dateLabel}</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>
              )}
              {isSystem ? (
                <SystemMessage
                  title={
                    msg.type === 'notice'
                      ? '거래 시 주의해주세요!'
                      : msg.type === 'info'
                        ? '약속이 등록되었습니다!'
                        : undefined
                  }
                  content={msg.content}
                  variant={msg.type ?? 'info'}
                />
              ) : (
                <ChatMessageItem
                  message={{ ...msg, timestamp: formatTime(msg.timestamp) }}
                  isMyMessage={msg.senderId === '1'} // 추후 로그인한 사용자 ID랑 비교하도록 변경
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={handleSendMessage}
        showOptions={showOptions}
        onToggleOptions={toggleOptions}
        onScheduleClick={() => setShowScheduleModal(true)}
      />

      {showScheduleModal && (
        <ScheduleModal
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={(msg) => handleSendSystemMessage(msg, 'info')}
        />
      )}
    </div>
  );
}

export default ChatRoom;
