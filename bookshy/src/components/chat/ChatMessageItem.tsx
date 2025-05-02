import { ChatMessage } from '../../types/chat';

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
}

function ChatMessageItem({ message, isMyMessage }: Props) {
  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} px-2 py-1 mb-2`}>
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div
          className={`px-3 py-2 rounded-2xl max-w-[70%] break-words ${
            isMyMessage ? 'bg-primary-light text-white' : 'bg-light-bg-shade text-light-text'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 min-w-[35px] text-right">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

export default ChatMessageItem;
