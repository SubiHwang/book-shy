import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  src: string;
  onImageChange: (file: File) => void;
}

const ProfileImage: React.FC<Props> = ({ src, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageChange(file);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <img
          src={src || '/default-profile.png'}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <button
          onClick={handleButtonClick}
          className="absolute bottom-0 right-0 bg-white text-primary rounded-full p-1 shadow"
        >
          <Camera strokeWidth={2}/>
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImage;
