interface ApiCard {
  value: number;
  suit: number;
}

export interface GameState {
  player_hand: ApiCard[];
  community_cards: ApiCard[];
  pot: number;
  player_stack: number;
  current_bet: number;
  position_from_dealer: number;
}

interface AIMoveResponse {
  move: string; // e.g. "raise", "fold", etc.
  value: number; // 0 if not raise
}

export async function getMove(gameState: GameState) {
  const response = await fetch("http://localhost:8000/ai/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameState),
  });
  const data: AIMoveResponse = await response.json();
  return data;
}
