import { styled } from "styled-components";

export type Props = {
  payout: number;
};

export function PayoutDisplay({ payout }: Props) {
  if (payout === 0) {
    return null;
  }

  return (
    <PayoutContainer>
      <PayoutText>
        {payout > 0 ? "+" : ""}${payout}
      </PayoutText>
    </PayoutContainer>
  );
}

const PayoutContainer = styled.div`
  padding: 0.5rem;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const PayoutText = styled.div`
  font-size: 18px;
`;

