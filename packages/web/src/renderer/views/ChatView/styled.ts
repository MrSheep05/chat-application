import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Tag } from '@mui/icons-material';

export const StyledContainer = styled(Box)({
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const StyledHeader = styled(Box)({
  flexDirection: 'row',
  display: 'flex',
  width: '100%',
  gap: '0.5em',
  alignSelf: 'flex-start',
  padding: '1em',
});

export const StyledRoomName = styled(Typography)({});

export const StyledRoomIcon = styled(Tag)({});

export const StyledDivider = styled(Divider)({
  display: 'flex',
  width: '100%',
});
