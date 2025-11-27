import { BlindType } from "../enums/BlindType";
import { HandType } from "../enums/HandType";
import { Card } from "../models/card.model";
import { HandStrength } from "../models/handStrength.model";

// creates a shuffled array of all cards
export const deal = (): Card[] => {
  let deck: Card[] = [];
  for (let s = 0; s < 4; s++) {
    for (let i = 1; i < 14; i++) {
      deck.push({
        value: i,
        suit: s,
        photoMap: i + "_" + s,
        isShown: false,
      });
    }
  }
  // shuffle
  deck = shuffleArray(deck);
  console.log(deck);
  return deck;
};

// shuffles an array using random index swapping
export const shuffleArray = <T>(values: T[]): T[] => {
  let localArray = [...values];
  for (let i = localArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [localArray[i], localArray[j]] = [localArray[j], localArray[i]];
  }
  return localArray;
};

// returns array in turn order of new blinds
export const getNewBlinds = (
  numberOfPlayers: number,
  currentLittleBlind: number
): BlindType[] => {
  const nextDealer = currentLittleBlind;
  const nextSmallBlind = nextDealer + 1 >= numberOfPlayers ? 0 : nextDealer + 1;
  const nextBigBlind =
    nextSmallBlind + 1 >= numberOfPlayers ? 0 : nextSmallBlind + 1;
  const newBlinds: BlindType[] = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    if (i === nextSmallBlind) {
      newBlinds.push(BlindType.SmallBlind);
    } else if (i === nextBigBlind) {
      newBlinds.push(BlindType.BigBlind);
    } else if (i === nextDealer) {
      // dealer needs to be lower so dealer isn't added in two player
      newBlinds.push(BlindType.Dealer);
    } else {
      newBlinds.push(BlindType.NoBlind);
    }
  }
  return newBlinds;
};

export const getHandValue = (cards: Card[]): HandStrength => {
  // get comparison data
  const suites = cards.map((c) => {
    return c.suit;
  });
  const ranks = cards
    .map((c) => {
      if (c.value === 1) return 14;
      return c.value;
    })
    .sort((a, b) => b - a);
  const suiteCounts = GiveTopTwoOccurances(suites);
  const hasFlush = suiteCounts.hc >= 5;
  const valueCounts = GiveTopTwoOccurances(ranks);
  const straightCheck = CheckStraight(ranks);

  // check hand rankes and add kickers
  if (hasFlush && straightCheck.isStraight && ranks[0] === 14) {
    return { handType: HandType.RoyalFlush, kickers: [] };
  }
  if (hasFlush && straightCheck.isStraight) {
    return {
      handType: HandType.StraightFlush,
      kickers: [straightCheck.topValue],
    };
  }
  if (valueCounts.hc === 4) {
    return {
      handType: HandType.FourOfAKind,
      kickers: [valueCounts.hv, valueCounts.sv],
    };
  }
  if (valueCounts.hc === 3 && valueCounts.sc === 2) {
    return {
      handType: HandType.FullHouse,
      kickers: [valueCounts.hv, valueCounts.sv],
    };
  }
  if (hasFlush) {
    const flushedValues = cards
      .filter((c) => c.suit === suiteCounts.hv)
      .map((c) => {
        return c.value;
      })
      .sort((a, b) => b - a);
    return { handType: HandType.Flush, kickers: flushedValues };
  }
  if (straightCheck.isStraight) {
    return { handType: HandType.Straight, kickers: [straightCheck.topValue] };
  }
  if (valueCounts.hc === 3) {
    return {
      handType: HandType.ThreeOfAKind,
      kickers: [valueCounts.hv, ...ranks.filter((r) => r !== valueCounts.hv)],
    };
  }
  if (valueCounts.hc === 2 && valueCounts.sc === 2)
    return {
      handType: HandType.TwoPair,
      kickers: [
        valueCounts.hv,
        valueCounts.sv,
        ...ranks.filter((r) => r !== valueCounts.hv && r !== valueCounts.sv),
      ],
    };
  if (valueCounts.hc === 2) {
    return {
      handType: HandType.OnePair,
      kickers: [valueCounts.hv, ...ranks.filter((r) => r !== valueCounts.hv)],
    };
  }
  return { handType: HandType.HighCard, kickers: ranks };
};

const GiveTopTwoOccurances = (values: number[]) => {
  const occurances: Record<number, number> = {};
  for (const value of values) {
    occurances[value] = (occurances[value] ?? 0) + 1;
  }
  let highestNumberOfSimilar = -1;
  let valueOfHighestNumber = -1;
  let secondNumberOfSimilar = -1;
  let valueOfSecondNumber = -1;
  for (const [value, count] of Object.entries(occurances)) {
    if (
      count >= highestNumberOfSimilar &&
      parseInt(value) > valueOfHighestNumber
    ) {
      secondNumberOfSimilar = highestNumberOfSimilar;
      valueOfSecondNumber = valueOfHighestNumber;
      highestNumberOfSimilar = count;
      valueOfHighestNumber = parseInt(value);
    } else if (
      count >= secondNumberOfSimilar &&
      parseInt(value) > valueOfSecondNumber
    ) {
      secondNumberOfSimilar = count;
      valueOfSecondNumber = parseInt(value);
    }
  }
  return {
    hc: highestNumberOfSimilar,
    hv: valueOfHighestNumber,
    sc: secondNumberOfSimilar,
    sv: valueOfSecondNumber,
  };
};

const CheckStraight = (
  values: number[]
): { topValue: number; isStraight: boolean } => {
  let formattedValues = [...new Set(values)].sort((a, b) => a - b);
  // check for ace wrap around
  if (formattedValues.includes(14)) formattedValues = [1, ...formattedValues];
  let count = 1;
  let prev = -1;
  for (const value of formattedValues) {
    if (value === prev + 1) {
      count++;
    } else {
      count = 0;
    }
    if (count === 5) return { topValue: value, isStraight: true };
    prev = value;
  }
  return { topValue: 0, isStraight: false };
};
