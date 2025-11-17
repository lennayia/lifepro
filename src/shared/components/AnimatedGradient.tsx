/**
 * AnimatedGradient Component
 * Animovaný gradient pozadí pro auth stránky
 */

'use client';

import React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GradientContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  background: `
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 25%,
      #f093fb 50%,
      #4facfe 75%,
      #667eea 100%
    )
  `,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(100px)',
  },
}));

const FloatingOrb = styled(Box)<{ delay?: number; size?: number }>(
  ({ delay = 0, size = 300 }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
    animation: `${keyframes`
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.5;
      }
      33% {
        transform: translate(50px, 100px) scale(1.1);
        opacity: 0.8;
      }
      66% {
        transform: translate(-30px, 50px) scale(0.9);
        opacity: 0.6;
      }
      100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.5;
      }
    `} ${20 + delay}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

interface AnimatedGradientProps {
  showOrbs?: boolean;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ showOrbs = true }) => {
  return (
    <GradientContainer>
      {showOrbs && (
        <>
          <FloatingOrb
            delay={0}
            size={400}
            sx={{ top: '10%', left: '5%', opacity: 0.4 }}
          />
          <FloatingOrb
            delay={5}
            size={350}
            sx={{ top: '50%', right: '10%', opacity: 0.3 }}
          />
          <FloatingOrb
            delay={10}
            size={300}
            sx={{ bottom: '20%', left: '30%', opacity: 0.5 }}
          />
        </>
      )}
    </GradientContainer>
  );
};

export default AnimatedGradient;
