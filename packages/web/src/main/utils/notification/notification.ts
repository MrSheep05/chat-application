import { App, Notification } from 'electron';

const showNotification = (app: App, args: string[]) => {
    const [username, message] = args;
    const messageToShow =
        message.length >= 25 ? `${message.substring(0, 24)}...` : message;
    // new Notification({ title: username, body: messageToShow }).show();

    new Notification({
        title: username,
        body: messageToShow,
        icon: 'https://chat-avatars-0luhsnz0s2.s3.eu-west-2.amazonaws.com/users/7c02ac16-2581-11ef-a9eb-0afd7d52d28d/avatar.png',
    }).show();

    const badgeCount = app.getBadgeCount();
    app.setBadgeCount(badgeCount + 1);
};
export default showNotification;
