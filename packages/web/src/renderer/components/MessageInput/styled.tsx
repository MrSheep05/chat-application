import { Box, Input } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  padding: '1em',
});

export const StyledForm = styled('form')({
  flex: 1,
  display: 'flex',
});

export const StyledInput = styled(Input)({
  display: 'flex',
  height: '3em',
  width: '100%',
  backgroundColor: '#373A3F',
  color: '#6C6F78',
  borderRadius: '5px',
  padding: '1em',
});
