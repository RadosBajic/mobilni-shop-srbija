
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

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
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const verified = userInput === captchaText;
    setIsVerified(verified);
    onVerify(verified);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="captcha">CAPTCHA</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={generateCaptcha}
          className="h-6 w-6"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="sr-only">Regenerate CAPTCHA</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div 
          className="bg-muted px-4 py-2 rounded font-mono text-lg tracking-wider select-none"
          style={{ 
            fontFamily: 'monospace', 
            letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Add some noise to make it harder for OCR */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #00000011 1px, transparent 1px)',
            backgroundSize: '4px 4px',
            pointerEvents: 'none',
          }} />
          
          {/* Distort text slightly */}
          <div className="relative">
            {captchaText.split('').map((char, i) => (
              <span key={i} style={{ 
                display: 'inline-block',
                transform: `rotate(${Math.random() * 10 - 5}deg) translateY(${Math.random() * 4 - 2}px)`,
                color: `hsl(${Math.random() * 360}, 70%, 30%)`
              }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <Input 
            type="text" 
            id="captcha"
            placeholder="Enter the code" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleVerify}
          className="flex-shrink-0"
          disabled={userInput.length === 0}
        >
          Verify
        </Button>
      </div>
      
      {isVerified && (
        <div className="text-sm text-green-600 font-medium">
          ✓ CAPTCHA verified
        </div>
      )}
    </div>
  );
};
