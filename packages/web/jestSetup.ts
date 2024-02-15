import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const fetchMock = fetch as any;

fetchMock.mockResponse(JSON.stringify({ mock: true }));

console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

window.alert = jest.fn();
window.electron = {
  ipcRenderer: {
    sendMessage: jest.fn(),
  },
  store: {
    get: jest
      .fn()
      .mockReturnValue(
        'eyJhbGciOiJSU0FTU0FfUFNTX1NIQV8yNTYiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJmaWxpcCIsImlzcyI6ImNoYXQiLCJpYXQiOjE2ODA3MjIwODksImV4cCI6MTY4MDcyMjE0OX0.Kw1rGzO4lmpuspcdgcmebHtSEUe8VOu6YVyVIL-hVNfhOS0qXNjIiQg4YojOuc2B1_ayTgmZe7UT5IL4bNR6TW-aEAaMW2YYB30zTRZEM-BQ20ReDCkCAoOncAArLgkMMdNuLuyqjjlWASJAP1qTOVR8470afAaC4Jggp1ayypqrVhqCyQVt_POEfFQ7Z5TxV6hKp6jPI2P9Msx68MjH-55_BU8NltwYPukiAf0DambhqIi8x5Siv0AfB3sKGss-usRMRyJXolcoIw71CiW4GMAt3Bt5bplEvLYv073spbrWYZPFOCNZyqbc-wMY_24Ctow4OyE70SFFlrhDHpXqt7eg_ZuXf6P6ByuY6NY6putjEevLj03LV95I1app1uWd7ig0LdwKUncTnb9A0qUuvdLzjLaVHjnWO7LWQkAXtHiGkmuZRZPKxqu3HHDoqNStK-YDY4CyJ1MyjoFeA23ULEsVOqW7Ps00Fdo3ozA91Upy57wqJ7fbxaCum_Cc8UaxJSFt91SrjKShNaUKomSgQ8PNG3O0hSH2SG8-SHbTFr7TqchLYq5REHPJz4x7vyqV8v5a79dlp6C9VGELrfWHdS33QEo4OoeobS3Ml9td3Rk5ejCQpl06XXvkHTW3ioUSDo1JtM6W8eXe4Gjj1LsXFyb_Bel2TREtccZ7J2x0elA'
      ),
    set: jest.fn(),
  },
} as unknown as typeof window.electron;
