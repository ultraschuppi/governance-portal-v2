import { Tag } from 'modules/app/types/tag';

export type DelegateStatus = 'recognized' | 'expired' | 'shadow';

export type DelegateRepoInformation = {
  voteDelegateAddress: string;
  picture?: string;
  name: string;
  externalUrl: string;
  description: string;
  combinedParticipation?: string;
  pollParticipation?: string;
  executiveParticipation?: string;
  communication?: string;
  cuMember?: boolean;
  tags?: string[];
};

export type DelegateContractInformation = {
  address: string;
  voteDelegateAddress: string;
  blockTimestamp: string;
  mkrDelegated: string;
  proposalsSupported: number;
  mkrLockedDelegate: MKRLockedDelegateAPIResponse[];
};

export type Delegate = {
  id: string;
  name: string;
  address: string;
  voteDelegateAddress: string;
  description: string;
  picture: string;
  status: DelegateStatus;
  expired: boolean;
  lastVoteDate: string | null;
  expirationDate: Date;
  externalUrl?: string;
  combinedParticipation?: string;
  pollParticipation?: string;
  executiveParticipation?: string;
  communication?: string;
  cuMember?: boolean;
  mkrDelegated: string;
  proposalsSupported: number;
  execSupported: CMSProposal | undefined;
  mkrLockedDelegate: MKRLockedDelegateAPIResponse[];
  blockTimestamp: string;
  tags: Tag[];
};

export type DelegationHistory = {
  address: string;
  lockAmount: string;
  events: DelegationHistoryEvent[];
};

export type DelegationHistoryEvent = {
  lockAmount: string;
  blockTimestamp: string;
  hash: string;
};

export type MKRLockedDelegateAPIResponse = {
  fromAddress: string;
  immediateCaller: string;
  lockAmount: string;
  blockNumber: number;
  blockTimestamp: string;
  lockTotal: string;
  callerLockTotal: string;
  hash: string;
};

export type MKRDelegatedToDAIResponse = MKRLockedDelegateAPIResponse & {
  hash: string;
  immediateCaller: string;
};
