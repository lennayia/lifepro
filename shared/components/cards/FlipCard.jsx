import { useState } from 'react';
import { Box, Card } from '@mui/material';
import { motion } from 'framer-motion';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * FlipCard - Interaktivní otáčitelná karta s 3D efektem
 *
 * @param {Object} props
 * @param {ReactNode} props.frontContent - Obsah přední strany karty
 * @param {ReactNode} props.backContent - Obsah zadní strany karty
 * @param {boolean} props.clickToFlip - Otočit při kliknutí (default: true)
 * @param {number} props.flipDuration - Délka animace v sekundách (default: 0.6)
 * @param {string|Object} props.gradient - Gradient pro pozadí (default: null)
 * @param {number} props.minHeight - Minimální výška karty v px (default: 200)
 * @param {Function} props.onFlip - Callback při otočení (isFlipped) => void
 * @param {Object} props.sx - Dodatečné MUI sx styly
 *
 * @example
 * <FlipCard
 *   frontContent={<Box>Přední strana</Box>}
 *   backContent={<Box>Zadní strana</Box>}
 *   gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
 *   onFlip={(isFlipped) => playSound(isFlipped ? 'flip' : 'flipBack')}
 * />
 *
 * @created 12.11.2025
 */
const FlipCard = ({
  frontContent,
  backContent,
  clickToFlip = true,
  flipDuration = 0.6,
  gradient = null,
  minHeight = 200,
  onFlip = null,
  sx = {},
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = () => {
    if (!clickToFlip) return;
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    if (onFlip) onFlip(newFlipped);
  };

  const cardStyles = {
    width: '100%',
    height: '100%',
    minHeight,
    background: gradient || 'transparent',
    borderRadius: BORDER_RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
  };

  return (
    <Box
      sx={{
        perspective: '1000px',
        minHeight,
        width: '100%',
        ...sx,
      }}
    >
      <Box
        onClick={handleFlip}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight,
          transformStyle: 'preserve-3d',
          transition: `transform ${flipDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: clickToFlip ? 'pointer' : 'default',
        }}
      >
        {/* Front side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <Card elevation={0} sx={cardStyles}>
            {frontContent}
          </Card>
        </Box>

        {/* Back side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Card elevation={0} sx={cardStyles}>
            {backContent}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default FlipCard;
