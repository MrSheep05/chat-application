import { dialog } from 'electron';
import { FileDialogOptions, HandleFileDialogFn } from './types';
import fs from 'fs';
import { FileCategories, FileCategory } from '../../../common/types';

export const handleFileDialog: HandleFileDialogFn = async (dialogOptions) => {
  if (!isValidFileDialogOptions(dialogOptions)) {
    throw new Error('Invalid Arguments');
  }

  const { fileCategory } = dialogOptions;
  const filePath = await openFile(fileCategory);

  console.log('FILE PATH', filePath);
  return fs.readFileSync(filePath);
};

const openFile = async (fileCategory: FileCategory) => {
  const {
    canceled,
    filePaths: [filePath],
  } = await dialog.showOpenDialog({
    filters: [{ name: fileCategory, extensions: FileCategories[fileCategory] }],
    properties: ['openFile'],
  });

  if (canceled) {
    throw new Error('Dialog was canceled');
  }

  return filePath;
};

const isValidFileDialogOptions = (args: unknown): args is FileDialogOptions => {
  try {
    if (typeof args !== 'object' || args === null || !('fileCategory' in args))
      return false;

    const { fileCategory } = args;

    if (typeof fileCategory !== 'string') return false;

    return Object.values(FileCategory).some(
      (category) => category === fileCategory
    );
  } catch (_) {}
  return false;
};
