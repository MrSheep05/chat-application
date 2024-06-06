export interface ITemplates {
  [code: number]: string;
}

type Message = string | { [key: string]: any };

export type CreateBodyFn = (
  statusCode: number,
  message?: Message
) => string | undefined;

interface ICreateResponseParams {
  statusCode?: number;
  message?: Message;
}

export type CreateResponseFn = ({
  statusCode,
  message,
}: ICreateResponseParams) => {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  message?: Message;
};
