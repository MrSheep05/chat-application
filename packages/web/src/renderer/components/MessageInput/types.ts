export interface MessageInputProps {
  value: string;
  onSubmit: (event: React.SyntheticEvent) => void;
  onChange: (value: string) => void;
}
