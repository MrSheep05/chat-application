import { keyframes, styled } from '@mui/system';
import { Avatar, Box, Typography } from '@mui/material';

const test = keyframes`
  from {
    background-position: -150vw 2em;
  }
  
  to {
    background-position: -50vw 2em;
  }
`;

export const StyledMessageWrapper = styled(Box)({
  gap: '0.5em',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   top: 0,
  //   left: 50,
  //   bottom: 0,
  //   width: '50px',
  //   // background: 'linear-gradient(to left, #eee, #f4f4f4, #eee)',
  //   backgroundImage:
  //     'linear-gradient(to left, #3B3E41, #3B3E41, #fff, #3B3E41, #3B3E41)',
  //   animation: `${loading} 1s infinite ease`,
  // },
});
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

export const StyledMessage = styled(Typography)(
  ({ length }: { length: number }) => ({
    minHeight: '1.5em',
    width: `${length}%`,
    background:
      'linear-gradient(90deg, rgba(59,62,65,1) 0%, rgba(100,105,110,1) 17%, rgba(100,105,110,1) 20%, rgba(59,62,65,1) 27%)',
    borderRadius: '0.75em',
    backgroundSize: `100vw 2em`,
    backgroundPosition: `-150vw 0px`,
    display: 'flex',
    transition: 'all linear .6s',
    animation: `${test} 2s infinite ease`,
    alignItems: 'center',
    justifyContent: 'center',
  })
);

export const StyledUsername = styled(Typography)({
  textAlign: 'left',
  fontWeight: 'bold',
  wordBreak: 'break-word',
});

export const StyledDate = styled(Typography)({});

export const StyledContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '3em',
  padding: '0 1em',
  gap: '10px',
  // background: 'linear-gradient(90deg, #eee, #f4f4f4, #eee)',
  // animation: `${loading} 1s infinite easet`,
});

export const StyledHeader = styled(Box)({
  display: 'flex',
  width: '40%',
  minHeight: '1em',
  borderRadius: '0.5em',
  backgroundColor: '#3B3E41',
});

export const StyledMoreOptions = styled(Box)({});

export const StyledAvatar = styled(Avatar)({
  backgroundColor: 'grey',
  color: 'black',
  opacity: '50%',
});
