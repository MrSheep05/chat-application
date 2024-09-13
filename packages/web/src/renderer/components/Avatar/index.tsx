import { useCallback, useContext } from 'react';
import avatarTemplate from '../../../../assets/avatar.jpeg';
import { StyledAvatar } from './styled';
import { AppState } from '../../state';
import { Channel, FileCategory } from '../../../common/types';

const Avatar = ({ avatarUrl, userId }: AvatarProps) => {
  const {
    state: { userData },
  } = useContext(AppState);

  const onAvatarClick = useCallback(async () => {
    if (userId != userData?.userId) {
      return;
    }

    window.electron.ipcRenderer.sendMessage(Channel.FileDialog, [
      { fileCategory: FileCategory.Images },
    ]);
  }, [userData, userId]);

  return (
    <StyledAvatar src={avatarUrl ?? avatarTemplate} onClick={onAvatarClick} />
  );
};

export default Avatar;
