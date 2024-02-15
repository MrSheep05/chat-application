import { Paper, Container, styled } from '@mui/material';

export const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  margin: 'auto',
  overflow: 'auto',
});

export const StyledIntersectionBox = styled(Paper)({
  backgroundColor: 'transparent',
  maxHeight: '1px',
  minHeight: '1px',
  width: '100%',
  alignSelf: 'center',
});
