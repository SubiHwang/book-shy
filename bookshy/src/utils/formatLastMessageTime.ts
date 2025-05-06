export function formatLastMessageTime(iso: string): string {
  const messageDate = new Date(iso);
  const now = new Date();

  const isSameDay =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    messageDate.getFullYear() === yesterday.getFullYear() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getDate() === yesterday.getDate();

  if (isSameDay) {
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else if (isYesterday) {
    return '어제';
  } else {
    return messageDate
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .replace(/\.$/, '');
  }
}
