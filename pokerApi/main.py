from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class GameState(BaseModel):
    shown_cards: list # [1c, 2h, 12s] etc
    player_cards: list
    pot: int
    player_stack: int
    current_bet: int
    position_from_dealer: int


class AIResponse(BaseModel):
    action: str
    value: int # 0 if not raise


@app.post("/ai/move", response_model=AIResponse)
def get_ai_player_move(game_state: GameState):
    move = AIResponse(move="raise", value=10)
    return move

