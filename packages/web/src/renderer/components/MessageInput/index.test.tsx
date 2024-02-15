import { render, screen } from '@testing-library/react';
import MessageInput from '.';

const renderMessageInput = (value = '') => {
  const onSubmit = jest.fn();
  const onChange = jest.fn();

  render(
    <MessageInput onSubmit={onSubmit} onChange={onChange} value={value} />
  );

  return { onChange, onSubmit };
};

describe('Given the ConnectingMessage', () => {
  it('should show the correct placeholder', () => {
    renderMessageInput();

    expect(screen.getByPlaceholderText('Message @general')).toBeVisible();
  });
});
