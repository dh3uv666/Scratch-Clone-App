import React, { useState, useEffect } from "react";

export default function BallSprite({ currentAction, style }) {
  const [speechBubble, setSpeechBubble] = useState(null);
  const [thoughtBubble, setThoughtBubble] = useState(null);

  useEffect(() => {
    if (currentAction) {
      const [action, ...params] = currentAction.split(':');

      if (action === 'say') {
        const [message, duration] = params;
        setSpeechBubble({ message, duration });
        setThoughtBubble(null);
        const timer = setTimeout(() => {
          setSpeechBubble(null);
        }, duration * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentAction]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        pointerEvents: 'none',
        width: 'auto',
        height: 'auto',
      }}>
        {(speechBubble || thoughtBubble) && (
          <div
            style={{
              position: 'relative',
              backgroundColor: speechBubble ? '#fff' : '#f0f0f0',
              padding: '8px 12px',
              borderRadius: '12px',
              border: '2px solid #000',
              maxWidth: '200px',
              minWidth: '50px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000',
              zIndex: 99999,
            }}
          >
            {speechBubble ? (
              <>
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #fff'
                }} />
                {speechBubble.message}
              </>
            ) : (
              <>
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #f0f0f0'
                }} />
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  {thoughtBubble.message.split('').map((char, i) => (
                    <span key={i} style={{ fontSize: '20px' }}>•</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sprite SVG */}
      <svg
        width={50}
        height={50}
        viewBox="0 0 24 24"
        version="1.1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <path
            d="M22,12c0,2.39-0.84,4.66-2.36,6.45c-0.14,0.16-0.28,0.31-0.42,0.46c-0.33,0.34-0.68,0.66-1.05,0.94
                    C16.42,21.25,14.27,22,12,22s-4.42-0.75-6.17-2.15c-0.37-0.28-0.72-0.6-1.05-0.94c-0.14-0.15-0.28-0.3-0.42-0.46
                    C2.84,16.66,2,14.39,2,12s0.84-4.66,2.36-6.45C4.5,5.39,4.64,5.24,4.78,5.09c0.33-0.34,0.68-0.66,1.05-0.94
                    C7.58,2.75,9.73,2,12,2s4.42,0.75,6.17,2.15c0.37,0.28,0.72,0.6,1.05,0.94c0.14,0.15,0.28,0.3,0.42,0.46
                    C21.16,7.34,22,9.61,22,12z"
            fill="#85C756"
          />
          <path
            d="M5.83,4.15c-0.37,0.28-0.72,0.6-1.05,0.94C4.64,5.24,4.5,5.39,4.36,5.55C5.58,7.46,6.23,9.68,6.23,12
                    s-0.65,4.54-1.87,6.45c0.14,0.16,0.28,0.31,0.42,0.46c0.33,0.34,0.68,0.66,1.05,0.94c1.56-2.29,2.4-5.01,2.4-7.85
                    C8.23,9.16,7.39,6.44,5.83,4.15z"
            fill="#FFD217"
          />
          <path
            d="M19.64,5.55c-0.14-0.16-0.28-0.31-0.42-0.46c-0.33-0.34-0.68-0.66-1.05-0.94c-1.56,2.29-2.4,5.01-2.4,7.85
                    c0,2.84,0.84,5.56,2.4,7.85c0.37-0.28,0.72-0.6,1.05-0.94c0.14-0.15,0.28-0.3,0.42-0.46c-1.22-1.91-1.87-4.13-1.87-6.45
                    S18.42,7.46,19.64,5.55z"
            fill="#FFD217"
          />
        </g>
      </svg>
    </div>
  );
}
