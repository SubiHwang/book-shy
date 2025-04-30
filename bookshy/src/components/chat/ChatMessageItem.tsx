import { ChatMessage } from '../../types/chat';

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
}

function ChatMessageItem({ message, isMyMessage }: Props) {
  if (message.senderId === 'system') {
    return (
      <div className="bg-red-50 text-sm text-light-text-muted rounded-lg p-4 mx-4 my-2 whitespace-pre-line">
        <p className="text-primary font-bold mb-1">거래 시 주의해주세요!</p>
        {message.content
          .split('\n')
          .slice(1)
          .map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
      </div>
    );
  }

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
