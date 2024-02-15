import { render, screen } from '@testing-library/react';
import ConnectingMessage from '.';

describe('Given the ConnectingMessage', () => {
  it('should show the correct message to the user', () => {
    render(<ConnectingMessage />);

    expect(screen.getByText('Connecting...')).toBeVisible();
  });
});
