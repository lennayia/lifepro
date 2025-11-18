/**
 * User Profile Page
 * Používá ProfileScreen z shared komponent
 */

'use client';

import { Box } from '@mui/material';
import { ProfileScreen } from '@/shared';

export default function ProfilePage() {
  return (
    <Box>
      <ProfileScreen />
    </Box>
  );
}
