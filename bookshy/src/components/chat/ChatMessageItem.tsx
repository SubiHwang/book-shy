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

function ChatMessageItem({
  message,
  isMyMessage,
  onLongPress,
  onRightClick,
  onSelectEmoji,
  showEmojiSelector,
  selectedEmoji,
}: Props) {
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
    { icon: <ThumbsUp size={18} />, label: '👍' },
    { icon: <Smile size={18} />, label: '😊' },
    { icon: <Check size={18} />, label: '✅' },
    { icon: <HelpCircle size={18} />, label: '❓' },
  ];

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} px-3 py-1 mb-2 relative`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div className="relative max-w-[85%] sm:max-w-[70%]">
          <div
            className={`px-4 py-2 rounded-2xl text-sm sm:text-base whitespace-pre-wrap break-words ${
              isMyMessage ? 'bg-primary-light text-white' : 'bg-light-bg-secondary text-light-text'
            }`}
          >
            {message.content}
          </div>

          {selectedEmoji && (
            <div className="absolute -bottom-5 left-3 flex items-center gap-1 bg-light-bg-card rounded-full px-2 py-[2px] shadow border border-light-bg-shade text-xs">
              <span>{selectedEmoji}</span>
              <span className="text-light-text-muted text-[11px]">1</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end min-w-[35px]">
          {isMyMessage && !message.read && (
            <span className="text-[10px] text-primary mt-[2px]">1</span>
          )}
          <span className="text-[10px] text-light-text-muted">{message.sentAt}</span>
        </div>
      </div>

      {showEmojiSelector && (
        <div className="absolute bottom-full mb-1 flex gap-1 bg-light-bg-card border border-light-bg-shade rounded-xl shadow p-1 z-20">
          {emojiList.map((emoji) => (
            <button
              key={emoji.label}
              className="p-1 hover:bg-light-bg-shade rounded-full transition"
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
