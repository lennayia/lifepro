import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Eye, Copy, Pencil, Share2, Trash2, User, MessageSquare, Calendar } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { createTextEllipsis } from '@shared/styles/responsive';
import { createIconButton, createClientPreviewButton } from '@shared/styles/modernEffects';
import { isTouchDevice, createSwipeHandlers, createLongPressHandler } from '@shared/utils/touchHandlers';
import { QuickTooltip } from '@shared/components/AppTooltip';
import { getAreaLabel, getStyleLabel, getAuthorityLabel } from '@shared/constants/coachingTaxonomy';

/**
 * BaseCard - Sdílená základní komponenta pro všechny karty v aplikaci
 *
 * 9-řádkový layout (reorganizovaný podle MaterialCard 5.11.2025):
 * 1. Velká ikona (vlevo) + Chipy + Datum přidání (vpravo)
 * 2. Akční ikony (Eye, Pencil, Copy, Share2, Trash2) - samostatný řádek
 * 3. Metadata (specifické podle typu karty)
 * 4. Odkaz/soubor nebo seznam materiálů
 * 5. Nadpis (2 řádky)
 * 6. Popis (3 řádky)
 * 7. Taxonomy chipy
 * 8. Tlačítko "Jak to vidí klientka"
 * 9. Feedback ikona (fixní výška pro zarovnání!)
 *
 * Používá:
 * - ProgramCard pro zobrazení programů (+ specifické Row 3 pro přístupnost)
 * - ClientCard pro zobrazení klientek (budoucí)
 * - MaterialCard JE standalone (tech debt - čeká na refactor)
 */
const BaseCard = ({
  // Řádek 1: Velká ikona (vlevo) + Chipy + Datum přidání (vpravo)
  largeIcon, // ReactNode - velká ikona/logo/kód programu
  chips, // Array of { label, icon, color, active }
  creationDate, // string nebo null - datum přidání

  // Řádek 2: Action ikony (samostatný řádek, všechny najednou)
  onPreview, // Handler pro náhled (Eye ikona)
  onEdit, // Handler pro editaci (Pencil ikona)
  onDuplicate, // Handler pro duplikaci (Copy ikona) - VŽDY zobrazená
  onShare, // Handler pro sdílení (Share2 ikona)
  onDelete, // Handler pro smazání (Trash2 ikona)

  // Řádek 3: Metadata
  metadata, // Array of { icon, label }

  // Řádek 4: Odkaz/soubor/materiály
  linkOrFile, // ReactNode nebo string

  // Řádek 5: Nadpis (2 řádky)
  title,

  // Řádek 6: Popis (3 řádky)
  description,

  // Řádek 7: Taxonomy chipy
  taxonomyOrAvailability, // ReactNode (chipy taxonomy)
  taxonomyData, // Object { coachingArea, topics, coachingStyle, coachingAuthority } - pro MaterialCard

  // Řádek 8: Tlačítko "Jak to vidí klientka"
  onClientPreview, // Handler pro tlačítko "Jak to vidí klientka" (zobrazí button pokud je předán)

  // Řádek 9: Feedback ikona (fixní výška pro zarovnání!)
  feedbackData, // Array - pole feedbacků (zobrazí feedback button pokud existuje)
  onFeedbackClick, // Handler pro klik na feedback button

  // Custom footer (pokud je potřeba)
  footer, // ReactNode - custom footer content (např. reflexe)

  // Styling
  minHeight = 280,
  glassEffect = 'subtle', // 'subtle' | 'normal' | 'strong'

  // Other
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glassCardStyles = useGlassCard(glassEffect);
  const isVeryNarrow = useMediaQuery('(max-width:420px)');
  const isTouch = isTouchDevice();

  // Touch gestures - Swipe handlers
  const swipeHandlers = createSwipeHandlers({
    onSwipeLeft: () => {
      // Swipe left = smazat (destructive action)
      if (isTouch && onDelete) {
        onDelete();
      }
    },
    onSwipeRight: () => {
      // Swipe right = sdílet (positive action)
      if (isTouch && onShare) {
        onShare();
      }
    },
    threshold: 80, // Větší threshold pro prevenci nechtěného triggeru
  });

  // Touch gestures - Long press handler
  const longPressHandlers = createLongPressHandler({
    onLongPress: () => {
      // Long press = preview (explorační akce)
      if (isTouch && onPreview) {
        onPreview();
      }
    },
    delay: 600, // 600ms pro long press
  });

  // Generování action ikon z handlerů
  const actionIcons = [
    // 1. Preview (volitelné)
    onPreview && (
      <QuickTooltip key="preview" title="Náhled">
        <IconButton
          onClick={onPreview}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Eye size={isVeryNarrow ? 20 : 22} />
        </IconButton>
      </QuickTooltip>
    ),
    // 2. Upravit (volitelné) - HNED ZA OČIČKO
    onEdit && (
      <QuickTooltip key="edit" title="Upravit">
        <IconButton
          onClick={onEdit}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Pencil size={isVeryNarrow ? 20 : 22} />
        </IconButton>
      </QuickTooltip>
    ),
    // 3. Duplikovat (VŽDY zobrazená)
    <QuickTooltip key="duplicate" title="Duplikovat">
      <IconButton
        onClick={onDuplicate}
        sx={createIconButton('secondary', isDark, 'small')}
      >
        <Copy size={isVeryNarrow ? 20 : 22} />
      </IconButton>
    </QuickTooltip>,
    // 4. Sdílet (volitelné)
    onShare && (
      <QuickTooltip key="share" title="Sdílet">
        <IconButton
          onClick={onShare}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Share2 size={isVeryNarrow ? 20 : 22} />
        </IconButton>
      </QuickTooltip>
    ),
    // 5. Smazat (volitelné)
    onDelete && (
      <QuickTooltip key="delete" title="Smazat">
        <IconButton
          onClick={onDelete}
          sx={createIconButton('error', isDark, 'small')}
        >
          <Trash2 size={isVeryNarrow ? 20 : 22} />
        </IconButton>
      </QuickTooltip>
    ),
  ].filter(Boolean); // Odfiltrovat null/undefined

  // Chip color mapping funkce
  const getChipStyles = (chip) => {
    if (!chip) return {};

    const { color = 'primary', active = true } = chip;

    if (color === 'primary' && active) {
      return {
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(139, 188, 143, 0.12)',
        color: isDark
          ? 'rgba(139, 188, 143, 0.95)'
          : 'rgba(85, 107, 47, 0.95)',
      };
    }

    if (color === 'primary' && !active) {
      return {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
        color: 'text.secondary',
      };
    }

    // Default neutral
    return {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
      color: 'text.secondary',
    };
  };

  return (
    <Card
      onClick={onClick}
      {...swipeHandlers}
      {...longPressHandlers}
      elevation={0}
      sx={{
        ...glassCardStyles,
        height: '100%',
        minHeight,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS.card,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',

        // Hover efekt jen pro non-touch zařízení
        '&:hover': isTouch ? {} : {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: isDark
            ? '0 12px 24px rgba(0, 0, 0, 0.4)'
            : '0 12px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          p: 3,
          pr: 2.5,
          minWidth: 0,
          overflow: 'hidden',
          '&:last-child': { pb: 3 }
        }}
      >
        {/* Řádek 1: Velká ikona + Chipy + Datum přidání */}
        <Box display="flex" alignItems="center" gap={0.75} mb={1} flexWrap="wrap">
          {/* Velká ikona VLEVO - s negative margin pro alignment */}
          {largeIcon && (
            <Box sx={{ ml: -0.5 }}>{largeIcon}</Box>
          )}

          {/* Chipy - zarovnané doprava pomocí wrapper Box s ml="auto" */}
          {chips && chips.length > 0 && (
            <Box display="flex" gap={0.75} ml="auto">
              {chips.map((chip, index) => (
                <Chip
                  key={index}
                  icon={chip.icon}
                  label={chip.label}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    ...getChipStyles(chip),
                    border: 'none',
                    '& .MuiChip-label': {
                      px: isVeryNarrow ? 0.5 : 0.75,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                    '& .MuiChip-icon': {
                      marginLeft: '6px',
                      color: 'inherit',
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {/* Datum přidání VPRAVO - ml="auto" pro right-align */}
          {creationDate && (
            <Box display="flex" alignItems="center" gap={0.5} ml="auto">
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.65rem',
                }}
              >
                Přidáno
              </Typography>
              <Calendar
                size={11}
                style={{
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.65rem',
                }}
              >
                {creationDate}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Řádek 2: Akční ikony (samostatný řádek) */}
        {actionIcons && actionIcons.length > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={{ xs: 0.5, sm: 0.75 }}
            mb={1}
            mr={-1}
          >
            {actionIcons}
          </Box>
        )}

        {/* Řádek 3: Metadata (fixní výška pro zarovnání!) */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          mb={1}
          mr={-1}
          flexWrap="wrap"
          sx={{ minHeight: '1.5em' }}
        >
          {metadata && metadata.length > 0 && metadata.map((item, index) => (
            <Box key={index} display="flex" alignItems="center" gap={0.5}>
              {item.icon}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Řádek 5: Odkaz/soubor nebo seznam materiálů (fixní výška pro zarovnání!) */}
        <Box
          mb={1}
          mr={-1}
          sx={{
            minHeight: '1.2em',
            maxWidth: '100%',
          }}
        >
          {linkOrFile && (
            typeof linkOrFile === 'string' ? (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
                  ...createTextEllipsis(1),
                }}
              >
                {linkOrFile}
              </Typography>
            ) : (
              linkOrFile
            )
          )}
        </Box>

        {/* Řádek 6: Nadpis (2 řádky) */}
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontSize: isVeryNarrow ? '0.95rem' : { xs: '0.95rem', sm: '1rem' },
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.3,
              minHeight: '2.6em', // 2 řádky × 1.3 lineHeight
              mt: 0.5,
              mb: 1,
              mr: -1,
              ...createTextEllipsis(2),
            }}
          >
            {title}
          </Typography>
        )}

        {/* Řádek 7: Popis (3 řádky) */}
        {description !== undefined && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: isVeryNarrow ? '0.75rem' : { xs: '0.8rem', sm: '0.825rem' },
              lineHeight: 1.4,
              minHeight: '4.2em', // 3 řádky × 1.4 lineHeight
              mb: 1,
              mr: -1,
              ...createTextEllipsis(3),
            }}
          >
            {description || '\u00A0'}
          </Typography>
        )}

        {/* Řádek 7: Taxonomy chipy (fixně 4 pozice pro stejnou výšku karet) */}
        <Box
          display="flex"
          gap={0.75}
          mb={1.5}
          flexWrap="wrap"
          sx={{
            minHeight: isVeryNarrow ? '34px' : '38px',
            maxWidth: '100%',
          }}
        >
          {taxonomyOrAvailability ? (
            taxonomyOrAvailability
          ) : taxonomyData ? (
            <>
              {/* 1. Coaching Area - Primary (zelená) */}
              {taxonomyData.coachingArea && (
                <Chip
                  label={getAreaLabel(taxonomyData.coachingArea)}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.2)' : 'rgba(139, 188, 143, 0.15)',
                    color: isDark ? 'rgba(139, 188, 143, 0.95)' : 'rgba(85, 107, 47, 0.95)',
                    border: 'none',
                    flex: '0 0 auto',
                    maxWidth: { xs: '100%', xsm: 'calc(50% - 0.375rem)' },
                  }}
                />
              )}

              {/* 2. Topics (max 3 + "+X dalších") - Neutral (šedá) */}
              {taxonomyData.topics && taxonomyData.topics.slice(0, 3).map((topic, index) => (
                <Chip
                  key={index}
                  label={topic}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    color: 'text.secondary',
                    border: 'none',
                    flex: '0 0 auto',
                    maxWidth: { xs: '100%', xsm: 'calc(50% - 0.375rem)' },
                  }}
                />
              ))}
              {taxonomyData.topics && taxonomyData.topics.length > 3 && (
                <Chip
                  label={`+${taxonomyData.topics.length - 3}`}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    color: 'text.secondary',
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    flex: '0 0 auto',
                    maxWidth: { xs: '100%', xsm: 'calc(50% - 0.375rem)' },
                  }}
                />
              )}

              {/* 3. Coaching Style - Secondary (růžová) */}
              {taxonomyData.coachingStyle && (
                <Chip
                  label={getStyleLabel(taxonomyData.coachingStyle)}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    backgroundColor: isDark ? 'rgba(188, 143, 143, 0.2)' : 'rgba(188, 143, 143, 0.15)',
                    color: isDark ? 'rgba(188, 143, 143, 0.95)' : 'rgba(120, 80, 80, 0.95)',
                    border: 'none',
                    flex: '0 0 auto',
                    maxWidth: { xs: '100%', xsm: 'calc(50% - 0.375rem)' },
                  }}
                />
              )}

              {/* 4. Coaching Authority - Tertiary (zlatá) */}
              {taxonomyData.coachingAuthority && (
                <Chip
                  label={getAuthorityLabel(taxonomyData.coachingAuthority)}
                  size="small"
                  sx={{
                    height: isVeryNarrow ? 14 : 16,
                    fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                    fontWeight: 500,
                    backgroundColor: isDark ? 'rgba(188, 176, 143, 0.2)' : 'rgba(188, 176, 143, 0.15)',
                    color: isDark ? 'rgba(188, 176, 143, 0.95)' : 'rgba(120, 110, 80, 0.95)',
                    border: 'none',
                    flex: '0 0 auto',
                    maxWidth: { xs: '100%', xsm: 'calc(50% - 0.375rem)' },
                  }}
                />
              )}
            </>
          ) : (
            // Prázdný placeholder
            <Box sx={{ width: '1px', height: isVeryNarrow ? '14px' : '16px', visibility: 'hidden' }} />
          )}
        </Box>

        {/* Řádek 8: Tlačítko "Jak to vidí klientka" */}
        {onClientPreview && (
          <Button
            variant="contained"
            size="small"
            startIcon={<User size={14} />}
            onClick={onClientPreview}
            sx={{
              mt: 1.5,
              ...createClientPreviewButton(isDark)
            }}
          >
            Jak to vidí klientka
          </Button>
        )}

        {/* Řádek 9: Feedback ikona (fixní výška pro zarovnání!) */}
        <Box sx={{ minHeight: '2em', mt: 1 }}>
          {feedbackData && feedbackData.length > 0 && (
            <Box
              onClick={onFeedbackClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                marginLeft: 'auto',
                backgroundColor: isDark
                  ? 'rgba(139, 188, 143, 0.1)'
                  : 'rgba(85, 107, 47, 0.08)',
                border: '1px solid',
                borderColor: isDark
                  ? 'rgba(139, 188, 143, 0.2)'
                  : 'rgba(85, 107, 47, 0.2)',
                borderRadius: BORDER_RADIUS.small,
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: 'fit-content',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.15)'
                    : 'rgba(85, 107, 47, 0.12)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <MessageSquare
                size={14}
                strokeWidth={2}
                style={{ color: isDark ? 'rgba(139, 188, 143, 0.9)' : 'rgba(85, 107, 47, 0.9)' }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: '0.7rem',
                }}
              >
                {feedbackData.length}× reflexe
              </Typography>
            </Box>
          )}
        </Box>

        {/* Custom footer content (pokud je potřeba) */}
        {footer && (
          <Box mt={1}>
            {footer}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseCard;
