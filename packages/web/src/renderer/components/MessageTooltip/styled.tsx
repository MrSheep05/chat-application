import { styled } from '@mui/system';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';

export const StyledTooltip = styled(Tooltip)({
  maxHeight: '2vmin',
  maxWidth: '2vmin',
});

export const DeleteMessageButton = styled(IconButton)({
  color: '#B0B4B7',
});

export const MoreOptions = styled(Box)({});

export const DeleteIcon = styled(Delete)({
  width: '0.7em',
});
