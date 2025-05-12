import BookNoteHeaderCard from '@/components/mybooknote/booknote/BookNoteHeaderCard';

interface Props {
  title: string;
  author: string;
  publisher: string;
  coverUrl?: string;
}

const BookTripHeaderSection = ({ title, author, publisher, coverUrl }: Props) => (
  <div className="mb-4">
    <BookNoteHeaderCard title={title} author={author} publisher={publisher} coverUrl={coverUrl} />
    <h3 className="text-base font-semibold mt-2">책의 여정 살펴보기</h3>
  </div>
);

export default BookTripHeaderSection;
