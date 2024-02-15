import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  width: '100%',
});

export const StyledMessage = styled(Typography)({
  alignSelf: 'center',
});
