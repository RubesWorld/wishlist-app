import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../common/Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    const { getByText } = render(<Button title="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Click me" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click me" onPress={mockOnPress} loading={true} />
    );
    
    fireEvent.press(getByText('Click me'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button title="Click me" onPress={() => {}} loading={true} />
    );
    
    expect(getByTestId('button-loading')).toBeTruthy();
  });
});