import { Box } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * AnimatedGradient - Živý animovaný gradient pozadí
 *
 * @param {Object} props
 * @param {Array<string>} props.colors - Pole barev pro gradient (min 2)
 * @param {string} props.animation - Typ animace: 'pulse' | 'wave' | 'rotate' | 'shimmer' (default: 'pulse')
 * @param {number} props.duration - Délka jednoho cyklu animace v sekundách (default: 3)
 * @param {string} props.direction - Směr gradientu: '135deg' | '45deg' | '90deg' atd. (default: '135deg')
 * @param {number} props.opacity - Průhlednost 0-1 (default: 1)
 * @param {boolean} props.blur - Přidat blur efekt (default: false)
 * @param {ReactNode} props.children - Obsah nad gradientem
 * @param {Object} props.sx - Dodatečné MUI sx styly
 *
 * @example
 * <AnimatedGradient
 *   colors={['#667eea', '#764ba2', '#f093fb']}
 *   animation="wave"
 *   duration={5}
 * >
 *   <Typography>Obsah nad gradientem</Typography>
 * </AnimatedGradient>
 *
 * @created 12.11.2025
 */
const AnimatedGradient = ({
  colors = ['#667eea', '#764ba2'],
  animation = 'pulse',
  duration = 3,
  direction = '135deg',
  opacity = 1,
  blur = false,
  children = null,
  sx = {},
}) => {
  // Validace barev
  if (colors.length < 2) {
    console.warn('AnimatedGradient: Needs at least 2 colors');
    colors = ['#667eea', '#764ba2'];
  }

  // Vytvoř gradient string
  const createGradient = (colorSet) => {
    return `linear-gradient(${direction}, ${colorSet.join(', ')})`;
  };

  // Animation variants podle typu
  const getAnimationVariants = () => {
    switch (animation) {
      case 'pulse':
        return {
          animate: {
            background: [
              createGradient(colors),
              createGradient([...colors].reverse()),
              createGradient(colors),
            ],
            transition: {
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };

      case 'wave':
        return {
          animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: {
              duration,
              repeat: Infinity,
              ease: 'linear',
            },
          },
        };

      case 'rotate':
        return {
          animate: {
            backgroundImage: [
              createGradient(colors),
              createGradient([colors[1], colors[0], ...colors.slice(2)]),
              createGradient(colors),
            ],
            transition: {
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        };

      case 'shimmer':
        return {
          animate: {
            backgroundPosition: ['0% 0%', '200% 0%'],
            transition: {
              duration,
              repeat: Infinity,
              ease: 'linear',
            },
          },
        };

      default:
        return {
          animate: {
            background: createGradient(colors),
          },
        };
    }
  };

  const variants = getAnimationVariants();

  // Style pro wave a shimmer animace (potřebují backgroundSize)
  const additionalStyles =
    animation === 'wave' || animation === 'shimmer'
      ? {
          backgroundSize: '200% 200%',
        }
      : {};

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Animated gradient layer */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: createGradient(colors),
          opacity,
          filter: blur ? 'blur(20px)' : 'none',
          ...additionalStyles,
        }}
        {...variants}
      />

      {/* Content layer */}
      {children && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default AnimatedGradient;
