export type RemoveMessageFn = ({
  connectionId,
  messageId,
}: {
  connectionId: string;
  messageId: string;
}) => Promise<number>;
