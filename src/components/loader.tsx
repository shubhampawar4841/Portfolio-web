"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 4 seconds (matching animation duration), then fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <StyledWrapper className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center gap-8">
        <div className="battery-container">
          <div className="battery">
            <div className="battery-cap" />
            <div className="liquid-fill">
              <div className="bubble bubble1" />
              <div className="bubble bubble2" />
              <div className="bubble bubble3" />
            </div>
            <div className="battery-glow" />
          </div>
        </div>
        
        {/* Name */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Shubham
        </h1>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Outer wrapper */
  .battery-container {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 40px;
  }

  /* Battery Body */
  .battery {
    position: relative;
    width: 65px;
    height: 140px;
    background: white;
    border: 4px solid #94a3b8;
    border-radius: 15px;
    display: flex;
    align-items: flex-end;
    padding: 5px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  /* Battery Cap */
  .battery-cap {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 10px;
    background: #94a3b8;
    border-radius: 3px 3px 0 0;
  }

  /* Liquid Fill (Light Mode Default) */
  .liquid-fill {
    width: 100%;
    height: 0%;
    background: #3b82f6; /* blue */
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    animation: charge 4s linear infinite;
  }

  /* Bubbles */
  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    bottom: 5px;
    animation: bubble-rise 2s ease-in infinite;
  }

  .bubble1 {
    width: 10px;
    height: 10px;
    left: 6px;
  }

  .bubble2 {
    width: 14px;
    height: 14px;
    right: 8px;
    animation-delay: 0.5s;
    animation-duration: 2.5s;
  }

  .bubble3 {
    width: 8px;
    height: 8px;
    left: 22px;
    animation-delay: 1s;
    animation-duration: 1.8s;
  }

  /* Glossy highlight */
  .battery-glow {
    position: absolute;
    top: 10px;
    right: 8px;
    width: 10px;
    height: 120px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    pointer-events: none;
  }

  /* Charge animation */
  @keyframes charge {
    0% {
      height: 0%;
      filter: hue-rotate(0deg);
    }
    50% {
      height: 50%;
    }
    90% {
      height: 100%;
      filter: hue-rotate(45deg);
    }
    95% {
      height: 100%;
      opacity: 1;
    }
    100% {
      height: 100%;
      opacity: 0;
    }
  }

  /* Bubble rise animation */
  @keyframes bubble-rise {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateY(-80px);
      opacity: 0;
    }
  }

  /* ------------------------------------------------ */
  /* 🔥 DARK MODE SUPPORT */
  /* ------------------------------------------------ */

  @media (prefers-color-scheme: dark) {
    .battery {
      background: #1e293b; /* slate-800 */
      border-color: #475569; /* slate-600 */
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    }

    .battery-cap {
      background: #475569;
    }

    .liquid-fill {
      background: #84cc16; /* lime-500 */
      box-shadow: 0 0 20px rgba(132, 204, 22, 0.6);
    }

    .battery-glow {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export default Loader;

