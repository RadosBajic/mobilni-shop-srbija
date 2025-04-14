
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { useLanguage } from '@/contexts/LanguageContext';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const { language } = useLanguage();
  const [captchaText, setCaptchaText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = () => {
    // Generate a random string of 6 characters (letters and numbers)
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
    
    // Focus the input after generating a new CAPTCHA
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    generateCaptcha();
    // Create audio element for audio CAPTCHA
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleVerify = () => {
    const verified = userInput.toLowerCase() === captchaText.toLowerCase();
    setIsVerified(verified);
    onVerify(verified);
    
    // If not verified, generate a new CAPTCHA
    if (!verified && userInput.length > 0) {
      setTimeout(() => {
        generateCaptcha();
      }, 1000);
    }
  };

  const playAudioCaptcha = () => {
    if (!audioRef.current) return;
    
    // Stop any existing audio
    if (isPlaying) {
      audioRef.current.pause();
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    // Convert text to speech using browser's speech synthesis
    const utterance = new SpeechSynthesisUtterance(captchaText.split('').join(' '));
    utterance.rate = 0.8;  // Slower rate for better clarity
    
    // Use Web Speech API
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  // Add more randomness to each character for better security
  const getRandomStyle = (index: number) => {
    const rotation = Math.random() * 20 - 10;
    const yOffset = Math.random() * 8 - 4;
    const xOffset = Math.random() * 4 - 2;
    const scale = 0.9 + Math.random() * 0.3;
    const hue = Math.random() * 360;
    
    return {
      display: 'inline-block',
      transform: `rotate(${rotation}deg) translateY(${yOffset}px) translateX(${xOffset}px) scale(${scale})`,
      color: `hsl(${hue}, 70%, 30%)`,
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
      fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
    };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="captcha">
          {language === 'sr' ? 'CAPTCHA' : 'CAPTCHA'}
        </Label>
        <div className="flex space-x-1">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={generateCaptcha}
            className="h-6 w-6"
            title={language === 'sr' ? 'Generiši novi CAPTCHA' : 'Generate new CAPTCHA'}
            aria-label={language === 'sr' ? 'Generiši novi CAPTCHA' : 'Generate new CAPTCHA'}
          >
            <RefreshCw className="h-3 w-3" />
            <span className="sr-only">
              {language === 'sr' ? 'Osveži CAPTCHA' : 'Refresh CAPTCHA'}
            </span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={playAudioCaptcha}
            className="h-6 w-6"
            title={isPlaying 
              ? language === 'sr' ? 'Zaustavi zvuk' : 'Stop audio' 
              : language === 'sr' ? 'Slušaj CAPTCHA' : 'Listen to CAPTCHA'}
            aria-label={isPlaying 
              ? language === 'sr' ? 'Zaustavi zvuk' : 'Stop audio' 
              : language === 'sr' ? 'Slušaj CAPTCHA' : 'Listen to CAPTCHA'}
          >
            {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            <span className="sr-only">
              {isPlaying 
                ? language === 'sr' ? 'Zaustavi zvučni CAPTCHA' : 'Stop audio CAPTCHA' 
                : language === 'sr' ? 'Slušaj CAPTCHA' : 'Listen to CAPTCHA'}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div 
          className="bg-muted px-4 py-2 rounded font-mono text-lg tracking-wider select-none"
          style={{ 
            fontFamily: 'monospace', 
            letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
            position: 'relative',
            overflow: 'hidden',
            minWidth: '140px',
            textAlign: 'center'
          }}
          aria-hidden="true" // Hide from screen readers since we provide an audio alternative
        >
          {/* Add improved noise pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `
              radial-gradient(circle, #00000011 1px, transparent 1px),
              repeating-linear-gradient(45deg, transparent, transparent 3px, #00000005 3px, #00000005 5px)
            `,
            backgroundSize: '4px 4px, 10px 10px',
            pointerEvents: 'none',
          }} />
          
          {/* Add line-through patterns */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, transparent, transparent 47%, #00000010 49%, #00000010 51%, transparent 53%, transparent),
              linear-gradient(to bottom, transparent, transparent 47%, #00000010 49%, #00000010 51%, transparent 53%, transparent)
            `,
            backgroundSize: '100% 100%',
            pointerEvents: 'none',
          }} />
          
          {/* Enhanced text distortion */}
          <div className="relative">
            {captchaText.split('').map((char, i) => (
              <span key={i} style={getRandomStyle(i)}>
                {char}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <Input 
            type="text" 
            id="captcha"
            ref={inputRef}
            placeholder={language === 'sr' ? "Unesite kod" : "Enter the code"}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleVerify();
              }
            }}
            aria-label={language === 'sr' 
              ? "Unesite CAPTCHA kod koji vidite ili čujete" 
              : "Enter the CAPTCHA code that you see or hear"}
          />
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleVerify}
          className="flex-shrink-0"
          disabled={userInput.length === 0}
        >
          {language === 'sr' ? 'Potvrdi' : 'Verify'}
        </Button>
      </div>
      
      {isVerified && (
        <div className="text-sm text-green-600 font-medium" role="status">
          ✓ {language === 'sr' ? 'CAPTCHA potvrđen' : 'CAPTCHA verified'}
        </div>
      )}
    </div>
  );
};
