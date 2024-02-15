import { Notification, App } from 'electron';
import showNotification from './notification';

const appMock = {
  getBadgeCount: jest.fn().mockReturnValue(0),
  setBadgeCount: jest.fn(),
} as unknown as App;

const showSpy = jest.fn();

jest.mock('electron', () => {
  return {
    Notification: jest.fn().mockImplementation(() => {
      return {
        show: showSpy,
      };
    }) as unknown,
  };
});

describe('Given showNotification', () => {
  describe('When invoked with a short message', () => {
    beforeEach(() => {
      showNotification(appMock, ['Filip', 'test']);
    });

    it('should create a new Notification', () => {
      expect(Notification).toHaveBeenCalledWith({ body: 'test', title: 'Filip' });
    });

    it('should show the Notification', () => {
      expect(showSpy).toHaveBeenCalled();
    });

    it('should increment the badge by one', () => {
      expect(appMock.setBadgeCount).toHaveBeenCalledWith(1);
    });
  });

  describe('When invoked with a long message', () => {
    beforeEach(() => {
      showNotification(appMock, [
        'Filip',
        'A message that is longer than 24 characters',
      ]);
    });

    it('should truncate the message', () => {
      expect(Notification).toHaveBeenCalledWith({
        body: 'A message that is longer...',
        title: 'Filip',
      });
    });
  });
});
