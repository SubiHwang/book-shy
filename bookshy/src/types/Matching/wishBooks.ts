import { KeyboardEvent } from "react";

export interface SearchBarProps {
  onSearch: (e:KeyboardEvent<HTMLInputElement>) => void;
}
