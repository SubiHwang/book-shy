import { useRef } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import { ThumbsUp, Smile, Check, HelpCircle } from 'lucide-react';

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  onLongPress?: () => void;
  onRightClick?: () => void;
  onSelectEmoji?: (emoji: string) => void;
  showEmojiSelector?: boolean;
  selectedEmoji?: string;
}

function ChatMessageItem({ message, isMyMessage, onLongPress, onRightClick, onSelectEmoji, showEmojiSelector, selectedEmoji }: Props) {
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    touchTimer.current = setTimeout(() => {
      onLongPress?.();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick?.();
  };

  const emojiList = [
    { icon: <ThumbsUp size={16} />, label: '👍' },
    { icon: <Smile size={16} />, label: '😊' },
    { icon: <Check size={16} />, label: '✅' },
    { icon: <HelpCircle size={16} />, label: '❓' },
  ];

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} px-2 py-1 mb-2 relative`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div className="relative max-w-[70%]">
          <div
            className={`px-3 py-2 rounded-2xl break-words ${
              isMyMessage ? 'bg-primary-light text-white' : 'bg-white text-black'
            }`}
          >
            {message.content}
          </div>

          {selectedEmoji && (
            <div
              className="absolute -bottom-5 left-3 flex items-center gap-1 bg-white rounded-full px-2 py-[2px] shadow-sm border border-gray-200 text-sm"
              style={{ fontSize: '12px' }}
            >
              <span>{selectedEmoji}</span>
              <span className="text-[11px] text-gray-500">1</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end min-w-[35px]">
          <span className="text-[10px] text-gray-400 text-right">{message.sentAt}</span>
          {isMyMessage && !message.isRead && (
            <span className="text-[10px] text-primary mt-[2px]">1</span>
          )}
        </div>
      </div>

      {showEmojiSelector && (
        <div className="absolute bottom-full mb-1 flex gap-1 bg-white border border-gray-200 rounded-xl shadow-sm p-1 z-10">
          {emojiList.map((emoji) => (
            <button
              key={emoji.label}
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => onSelectEmoji?.(emoji.label)}
            >
              {emoji.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatMessageItem;
