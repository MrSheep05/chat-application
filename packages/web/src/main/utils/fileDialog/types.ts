import { FileCategory } from 'common/types';

export interface FileDialogOptions {
  fileCategory: FileCategory;
}

export type HandleFileDialogFn = (dialogOptions: unknown) => Promise<Buffer>;
