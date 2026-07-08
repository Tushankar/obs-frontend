import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteProgress() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const finishTimer = useRef(null);

  useEffect(() => {
    setVisible(true);
    setProgress(15);
    
    if (timer.current) clearInterval(timer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);

    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 80) {
          clearInterval(timer.current);
          return 80;
        }
        return p + Math.random() * 15;
      });
    }, 60);

    // Complete loader after 500ms matching mock API delay
    finishTimer.current = setTimeout(() => {
      if (timer.current) clearInterval(timer.current);
      setProgress(100);
      
      finishTimer.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 450);

    return () => {
      if (timer.current) clearInterval(timer.current);
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[10000] h-[3px] bg-[#C99E25] transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}
