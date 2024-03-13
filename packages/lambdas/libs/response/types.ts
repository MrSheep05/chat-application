export interface ITemplates {
  [code: number]: string;
}

export type CreateBodyFn = (
  statusCode: number,
  message?: string | object
) => string | undefined;

interface ICreateResponseParams {
  statusCode?: number;
  message?: string | object;
}

export type CreateResponseFn = ({
  statusCode,
  message,
}: ICreateResponseParams) => {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body?: string;
};
