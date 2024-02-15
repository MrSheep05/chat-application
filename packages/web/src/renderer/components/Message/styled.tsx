import { styled } from '@mui/system';
import { Avatar, Box, Typography } from '@mui/material';

export const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  width: 'calc("100%" - "2em")',
  margin: '0.5em 1em',
  boxSizing: 'border-box',
  '&:hover': {
    backdropFilter: 'brightness(0.95)',
  },
  '& #more-options': {
    display: 'none',
    position: 'absolute',
    right: '1em',
  },
  '&:hover #more-options': {
    display: 'flex',
  },
});

export const StyledMessage = styled(Typography)({
  textAlign: 'left',
  fontWeight: 'normal',
  wordBreak: 'break-word',
});

export const StyledUsername = styled(Typography)({
  textAlign: 'left',
  fontWeight: 'bold',
  wordBreak: 'break-word',
});

export const StyledDate = styled(Typography)({});

export const StyledContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1em',
});

export const StyledHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5em',
  alignItems: 'center',
});

export const StyledMoreOptions = styled(Box)({});

export const StyledAvatar = styled(Avatar)({});
