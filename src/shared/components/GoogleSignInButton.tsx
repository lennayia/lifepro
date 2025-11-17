/**
 * GoogleSignInButton Component
 * Tlačítko pro přihlášení přes Google OAuth
 */

'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#757575',
  border: '1px solid #dadce0',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '10px 16px',
  '&:hover': {
    backgroundColor: '#f7f8f8',
    border: '1px solid #d2d3d4',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
  },
  '&:active': {
    backgroundColor: '#ecedee',
  },
  '&:disabled': {
    backgroundColor: '#f7f8f8',
    color: '#bdbdbd',
  },
  '& .MuiButton-startIcon': {
    marginRight: '12px',
  },
}));

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </g>
  </svg>
);

interface GoogleSignInButtonProps extends Omit<ButtonProps, 'startIcon'> {
  onClick?: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <GoogleButton
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      {...props}
    >
      {children || 'Pokračovat s Google'}
    </GoogleButton>
  );
};

export default GoogleSignInButton;
