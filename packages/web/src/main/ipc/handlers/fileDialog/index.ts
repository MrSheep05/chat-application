import { handleFileDialog } from '../../../utils/fileDialog';
import { Channel } from '../../../../common/types';
import { IpcMainEvent } from 'electron';

export const onFileDialogEvent = async (event: IpcMainEvent, args: any) => {
    const [fileDialogOptions] = args;

    try {
        const fileBuffer = await handleFileDialog(fileDialogOptions);

        event.sender.send(Channel.FileDialog, fileBuffer);
    } catch (error) {
        console.error('Unable to fulfill the FileDialog request', error);
    }
};
