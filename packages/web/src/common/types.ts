enum FileType {
  JPG = 'jpg',
  PNG = 'png',
  GIF = 'gif',
  JPEG = 'jpeg',
}

export enum FileCategory {
  Images = 'Images',
}

type FileCategories = {
  [key in FileCategory]: Array<FileType>;
};

export const FileCategories: FileCategories = {
  [FileCategory.Images]: [
    FileType.JPG,
    FileType.PNG,
    FileType.GIF,
    FileType.JPEG,
  ],
} as const;

export enum Channel {
  Message = 'message',
  FileDialog = 'file',
}
