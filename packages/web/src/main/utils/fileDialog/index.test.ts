import { handleFileDialog } from '.';
import { dialog } from 'electron';
import fs from 'fs';
import { FileCategory } from '../../../common/types';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));

jest.mock('electron', () => ({
  ...jest.requireActual('electron'),
  dialog: {
    showOpenDialog: jest.fn(),
  },
}));

describe('Given the handleFileDialog function', () => {
  beforeEach(() => {
    mockResponses();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should open the dialog', async () => {
    await handleFileDialog(EXAMPLE_INPUT);

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }],
      properties: ['openFile'],
    });
  });

  it('should load the file', async () => {
    await handleFileDialog(EXAMPLE_INPUT);

    expect(fs.readFileSync).toHaveBeenCalledWith('file-path');
  });

  it('should return the file content', async () => {
    const result = await handleFileDialog(EXAMPLE_INPUT);

    expect(result).toHaveBeenCalledWith('file-content');
  });

  describe('When the parameters are incorrect', () => {
    test.each([
      'tururururur',
      null,
      { something: 'value' },
      { fileCategory: 5 },
      { fileCategory: 'unknown' },
    ])('should throw an error', async (input) => {
      await expect(() => handleFileDialog(input)).toThrow('Invalid Arguments');
    });
  });

  describe('When the dialog is canceled', () => {
    it('should throw an error', async () => {
      (dialog.showOpenDialog as jest.Mock).mockReturnValue({
        canceled: true,
        filePaths: [],
      });

      await expect(() => handleFileDialog(EXAMPLE_INPUT)).toThrow(
        'Dialog was canceled'
      );
    });
  });
});

const EXAMPLE_INPUT = {
  fileCategory: FileCategory.Images,
};

const mockResponses = () => {
  (fs.readFileSync as jest.Mock).mockReturnValue('file-content');
  (dialog.showOpenDialog as jest.Mock).mockReturnValue({
    canceled: false,
    filePaths: ['file-path'],
  });
};
