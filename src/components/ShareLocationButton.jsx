import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareLocationButton({ userLocation, theme }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!userLocation) return;

    const { lat, lng } = userLocation;
    const locationUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Current Location',
          text: 'Here is my current location:',
          url: locationUrl,
        });
      } catch (err) {
        console.error('Share canceled', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(locationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!userLocation}
      className={`
        p-2 rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${userLocation 
          ? `${theme.accent} text-white hover:shadow-md`
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
      `}
      title={userLocation ? 'Share your location' : 'Acquiring location...'}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
    </button>
  );
}
