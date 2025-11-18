import { useState, useRef, useEffect } from 'react';
import { Box, Avatar, IconButton, CircularProgress, Typography } from '@mui/material';
import { Camera, X as XIcon } from 'lucide-react';
import { useNotification } from '@shared/context/NotificationContext';
import { compressToWebP, validateImageFile, getCompressionStats } from '@shared/utils/imageCompression';
import { uploadPhoto, deletePhoto } from '@shared/utils/photoStorage';

/**
 * PhotoUpload - Reusable photo upload component
 *
 * Uses modular utils:
 * - imageCompression.js - Compress to WebP
 * - photoStorage.js - Upload/delete from Supabase
 *
 * Features:
 * - Click or drag & drop to upload
 * - Auto-compress to WebP
 * - Preview with delete option
 * - Loading states
 * - Google photo fallback
 *
 * Props:
 * - photoUrl: string - Current photo URL (custom uploaded)
 * - googlePhotoUrl: string - Google profile photo URL (fallback)
 * - onPhotoChange: (url: string|null) => void - Callback when photo changes
 * - userId: string - User ID for storage path
 * - bucket: string - Storage bucket name
 * - size: number - Avatar size in pixels (default: 120)
 * - maxSizeMB: number - Max upload size before compression (default: 2)
 * - quality: number - WebP quality 0-1 (default: 0.85)
 * - maxDimension: number - Max width/height after compression (default: 800)
 */
const PhotoUpload = ({
  photoUrl,
  googlePhotoUrl,
  onPhotoChange,
  userId,
  bucket,
  size = 120,
  maxSizeMB = 2,
  quality = 0.85,
  maxDimension = 800,
}) => {
  const { showError, showSuccess } = useNotification();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(photoUrl);
  const fileInputRef = useRef(null);

  // Display photo: custom upload (photoUrl) → Google photo (googlePhotoUrl) → placeholder
  const displayPhotoUrl = photoUrl || googlePhotoUrl;

  // Sync preview with photoUrl prop changes
  useEffect(() => {
    setPreview(photoUrl);
  }, [photoUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, {
      maxSizeBytes: maxSizeMB * 1024 * 1024,
    });

    if (!validation.valid) {
      showError('Neplatný soubor', validation.error);
      return;
    }

    try {
      setUploading(true);

      // Compress to WebP
      const compressedBlob = await compressToWebP(file, {
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        quality,
      });

      // Get compression stats
      const stats = getCompressionStats(file.size, compressedBlob.size);

      // Create File from Blob
      const compressedFile = new File(
        [compressedBlob],
        `photo-${Date.now()}.webp`,
        { type: 'image/webp' }
      );

      // Upload to Supabase Storage
      const { url } = await uploadPhoto(compressedFile, {
        bucket,
        userId,
      });

      setPreview(url);
      onPhotoChange(url);

      showSuccess(
        'Fotka nahrána',
        `Úspěšně nahrána (${stats.compressedKB} KB, ušetřeno ${stats.savedPercent}%)`
      );

    } catch (err) {
      console.error('PhotoUpload error:', err);
      showError('Chyba nahrávání', err.message || 'Nepodařilo se nahrát fotku');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!photoUrl) return;

    try {
      setUploading(true);

      await deletePhoto(photoUrl, bucket);

      setPreview(null);
      onPhotoChange(null);

      showSuccess('Fotka smazána', 'Fotka byla úspěšně odstraněna');

    } catch (err) {
      console.error('PhotoUpload delete error:', err);
      showError('Chyba mazání', err.message || 'Nepodařilo se smazat fotku');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Avatar with photo or placeholder */}
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={preview || displayPhotoUrl}
          imgProps={{
            referrerPolicy: 'no-referrer',
            loading: 'eager'
          }}
          sx={{
            width: size,
            height: size,
            fontSize: size / 3,
            bgcolor: 'primary.main',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              opacity: uploading ? 1 : 0.8,
            },
          }}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {!(preview || displayPhotoUrl) && <Camera size={size / 2} />}
        </Avatar>

        {/* Loading spinner */}
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={size / 3} sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Delete button - only show for custom uploaded photos */}
        {photoUrl && !uploading && (
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'error.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            <XIcon size={16} />
          </IconButton>
        )}

        {/* Camera icon for upload */}
        {!uploading && (
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              bgcolor: 'primary.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <Camera size={16} />
          </IconButton>
        )}
      </Box>

      {/* Instructions */}
      <Typography variant="caption" color="text.secondary" textAlign="center">
        Klikněte pro nahrání fotky
        <br />
        (max {maxSizeMB} MB, automaticky zkomprimuje do WebP)
      </Typography>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default PhotoUpload;
