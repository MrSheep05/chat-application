import { App, Notification } from 'electron';

const showNotification = (app: App, args: string[]) => {
  const [username, message] = args;
  const messageToShow =
    message.length >= 25 ? `${message.substring(0, 24)}...` : message;
  new Notification({ title: username, body: messageToShow }).show();

  const badgeCount = app.getBadgeCount();
  app.setBadgeCount(badgeCount + 1);
};
export default showNotification;
