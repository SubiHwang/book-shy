// components/profile/ProfileImage.tsx
const ProfileImage = ({ src }: { src: string }) => (
  <div className="flex justify-center mb-6">
    <div className="relative">
      <img
        src={src || '/default-profile.png'}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">📸</div>
    </div>
  </div>
);

export default ProfileImage;
