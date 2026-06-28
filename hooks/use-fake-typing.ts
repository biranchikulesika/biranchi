import { useState, useEffect, useCallback, useRef } from 'react';

const FAKE_CREDENTIALS = [
  { email: 'admin@example.com', password: 'password123' },
  { email: 'biranchi@gmail.com', password: 'password123' },
  { email: 'root@server.local', password: 'rootpassword' },
  { email: 'contact@website.com', password: 'welcome123' },
  { email: 'administrator@domain.com', password: 'qwertyuiop' },
  { email: 'admin@system.io', password: 'securepass123' },
  { email: 'user@test.com', password: 'password890' }
];

export function useFakeTyping(
  onFakeSubmit: (email: string, pass: string) => void,
  realEmail: string,
  realPassword: string
) {
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [isFakeTyping, setIsFakeTyping] = useState(false);

  const isIdleRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isHoveringRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const resetIdleTimerRef = useRef<() => void>(() => {});
  
  const realInputsRef = useRef({ email: realEmail, password: realPassword });
  
  // Stop everything immediately on user interaction
  const stopFakeTyping = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isIdleRef.current = false;
    setIsFakeTyping(false);
    setEmailText('');
    setPasswordText('');
  }, []);

  const startFakeSequence = useCallback(() => {
    if (!isIdleRef.current) return;
    
    // Pick random credentials
    const cred = FAKE_CREDENTIALS[Math.floor(Math.random() * FAKE_CREDENTIALS.length)];
    
    let currentPhase = 'email';
    let charIndex = 0;
    let currentEmail = '';
    let currentPassword = '';

    const typeNextChar = () => {
      if (!isIdleRef.current) return;

      let delay = Math.random() * 100 + 50; // 50-150ms per keystroke

      if (currentPhase === 'email') {
        if (charIndex < cred.email.length) {
          currentEmail += cred.email[charIndex];
          setEmailText(currentEmail);
          charIndex++;
          animationRef.current = setTimeout(typeNextChar, delay);
        } else {
          currentPhase = 'wait_password';
          animationRef.current = setTimeout(() => {
            currentPhase = 'password';
            charIndex = 0;
            typeNextChar();
          }, Math.random() * 400 + 200); // Pause before password
        }
      } else if (currentPhase === 'password') {
        if (charIndex < cred.password.length) {
          currentPassword += cred.password[charIndex];
          setPasswordText(currentPassword);
          charIndex++;
          animationRef.current = setTimeout(typeNextChar, delay);
        } else {
          currentPhase = 'submit';
          animationRef.current = setTimeout(() => {
             if (!isIdleRef.current) return;
             onFakeSubmit(cred.email, cred.password);
             
             // Wait briefly, then reset completely to normal screen and restart idle timer
             animationRef.current = setTimeout(() => {
               if (!isIdleRef.current) return;
               resetIdleTimerRef.current();
             }, 1000);
          }, Math.random() * 600 + 300); // Pause before submit
        }
      }
    };

    typeNextChar();
  }, [onFakeSubmit]);

  const resetIdleTimer = useCallback(() => {
    stopFakeTyping();
    
    if (isFocusedRef.current || isHoveringRef.current || realInputsRef.current.email !== '' || realInputsRef.current.password !== '') {
      return; // Don't become idle if input is focused, hovered, or has text
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!isFocusedRef.current && !isHoveringRef.current && realInputsRef.current.email === '' && realInputsRef.current.password === '') {
        isIdleRef.current = true;
        setIsFakeTyping(true);
        startFakeSequence();
      }
    }, 5000); // 5 seconds of inactivity
  }, [stopFakeTyping, startFakeSequence]);

  useEffect(() => {
    resetIdleTimerRef.current = resetIdleTimer;
  }, [resetIdleTimer]);

  useEffect(() => {
    realInputsRef.current = { email: realEmail, password: realPassword };
    // Whenever real inputs change (e.g. user typing), we should reset the idle timer
    // but the timer will immediately abort if there is text.
    resetIdleTimer();
  }, [realEmail, realPassword, resetIdleTimer]);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    stopFakeTyping();
  }, [stopFakeTyping]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      stopFakeTyping();
    };
  }, [resetIdleTimer, stopFakeTyping]);

  const handleInputFocus = () => {
    isFocusedRef.current = true;
    stopFakeTyping();
  };

  const handleInputBlur = () => {
    isFocusedRef.current = false;
    resetIdleTimer();
  };

  return {
    fakeEmail: emailText,
    fakePassword: passwordText,
    isFakeTyping,
    handleInputFocus,
    handleInputBlur,
    handleMouseEnter,
    handleMouseLeave,
  };
}
