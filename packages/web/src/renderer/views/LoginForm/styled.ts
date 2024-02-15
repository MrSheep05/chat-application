import { Card, TextField, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContainer = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'azure',
  padding: '2em',
  minHeight: '50vh',
  minWidth: '50vmin',
  justifyContent: 'center',
  alignContent: 'center',
});

export const StyledHeading = styled(Typography)({
  padding: '1em',
  textAlign: 'center',
  fontWeight: 'bold',
});

export const StyledInput = styled(TextField)({
  margin: '0.5em 0',
});

export const StyledButton = styled(Button)({
  margin: '0.5em 0',
});
