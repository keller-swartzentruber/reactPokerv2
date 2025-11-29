import { json } from "stream/consumers";

interface GameState {
  player_hand: string[]; // e.g. ["Ah", "Kd"]
  community_cards: string[]; // e.g. ["2c", "7d", "Jh"]
  pot: number;
  player_stack: number;
  current_bet: number;
  position_from_dealer: number;
}

interface AIMoveResponse {
  move: string; // e.g. "raise", "fold", etc.
  confidence: number; // e.g. 0.85
}

async function getMove(gameState: string) {
  const response = await fetch("http://localhost:8000/ai/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameState),
  });
  const data: AIMoveResponse = await response.json();
  return data.move;
}
