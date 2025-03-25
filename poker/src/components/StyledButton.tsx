import { styled } from "styled-components";

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function StyledButton({ label, onClick, disabled }: Props) {
  return (
    <>
      <ButtonStyles onClick={onClick} disabled={disabled}>
        {label}
      </ButtonStyles>
    </>
  );
}

const ButtonStyles = styled.button`
  font-size: 25px;
  height: 3rem;
  flex-grow: 1;
`;
