const BASE_URL = 'https://58arvrdkse.execute-api.eu-west-2.amazonaws.com/v1';

type RequestParams = {
  path: string;
  body: string;
  method: 'GET' | 'POST' | 'PUT';
};

type ResponseBody = {
  message?: string;
  token?: string;
  refreshToken?: string;
};

export const request = async ({
  path,
  body,
  method = 'GET',
}: RequestParams): Promise<ResponseBody> => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, { body, method });
    const responseBody = await response.json();

    if (response.ok) {
      return responseBody;
    }

    console.error('Response', response);

    throw new Error(responseBody?.message);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch');
  }
};

// import * as Request from './request';
// jest.spyOn(Request, 'request')

// export default request;
