import BigNumber from 'lib/bigNumberJs';
import { PollParameters } from './poll';
import { PollVoteType } from './pollVoteType';

export type RankedChoiceResult = {
  optionId: string;
  optionName: string;
  firstChoice: number;
  transfer: number;
  winner: boolean;
  eliminated: boolean;
  firstPct: number;
  transferPct: number;
};

export type PluralityResult = {
  optionId: string;
  optionName: string;
  winner: boolean;
  mkrSupport: number;
  winner: boolean;
  firstPct: number;
};

export type PollTallyPluralityOption = {
  mkrSupport: BigNumber;
  winner: boolean;
};

export type PollTallyRankedChoiceOption = {
  firstChoice: BigNumber;
  transfer: BigNumber;
  winner: boolean;
  eliminated: boolean;
};

export type PollTallyVote = {
  voter: string;
  optionId: number;
  optionIdRaw: string;
  mkrSupport: number;
  rankedChoiceOption?: number[];
};

export type RawPollTallyRankedChoice = {
  winner: string | null;
  rounds: number;
  numVoters: number;
  options: Record<number, PollTallyRankedChoiceOption>;
  totalMkrParticipation: BigNumber;
  votesByAddress?: PollTallyVote[];
};

export type RawPollTallyPlurality = {
  winner: string | null;
  numVoters: number;
  options: Record<number, PollTallyPluralityOption>;
  totalMkrParticipation: BigNumber;
  votesByAddress?: PollTallyVote[];
};

export type PollTallyRankedChoice = {
  parameters: PollParameters;
  winner: string | null;
  numVoters: number;
  results: RankedChoiceResult[];
  winningOptionName: string;
  totalMkrParticipation: number;
  votesByAddress?: PollTallyVote[];
  rounds?: number;
};

export type PollTallyPlurality = {
  parameters: PollParameters;
  winner: string | null;
  numVoters: number;
  results: PluralityResult[];
  winningOptionName: string;
  totalMkrParticipation: number;
  votesByAddress?: PollTallyVote[];
};

export type RawPollTally = RawPollTallyRankedChoice | RawPollTallyPlurality;

export type PollTally = PollTallyRankedChoice | PollTallyPlurality;
