import { useRef } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import { ThumbsUp, Smile, Check, HelpCircle } from 'lucide-react';

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  onLongPress?: () => void;
  showEmojiSelector?: boolean;
}

function ChatMessageItem({ message, isMyMessage, onLongPress, showEmojiSelector }: Props) {
  const touchStartTime = useRef<number | null>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    touchStartTime.current = Date.now();
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

  const emojiList = [
    { icon: <ThumbsUp size={16} />, label: 'LIKE' },
    { icon: <Smile size={16} />, label: 'SMILE' },
    { icon: <Check size={16} />, label: 'CHECK' },
    { icon: <HelpCircle size={16} />, label: 'QUESTION' },
  ];

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} px-2 py-1 mb-2 relative`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div
          className={`px-3 py-2 rounded-2xl max-w-[70%] break-words ${
            isMyMessage ? 'bg-primary-light text-white' : 'bg-light-bg-shade text-light-text'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 min-w-[35px] text-right">{message.sentAt}</span>
      </div>

      {showEmojiSelector && (
        <div className="absolute bottom-full mb-1 flex gap-1 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          {emojiList.map((emoji) => (
            <button
              key={emoji.label}
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => console.log(`Emoji selected: ${emoji.label}`)}
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
