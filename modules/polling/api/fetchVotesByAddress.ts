import BigNumber from 'lib/bigNumberJs';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { PollTallyVote } from '../types';
import { gqlRequest } from 'modules/gql/gqlRequest';
import { voteAddressMkrWeightsAtTime } from 'modules/gql/queries/voteAddressMkrWeightsAtTime';
import { networkNameToChainId } from 'modules/web3/helpers/chain';
import { parseRankedChoiceRawOptionId } from '../helpers/parseRankedChoiceRawOptionId';

export async function fetchVotesByAddressForPoll(
  pollId: number,
  endUnix: number,
  network: SupportedNetworks
): Promise<PollTallyVote[]> {
  const data = await gqlRequest({
    chainId: networkNameToChainId(network),
    query: voteAddressMkrWeightsAtTime,
    variables: { argPollId: pollId, argUnix: endUnix }
  });

  const results = data.voteAddressMkrWeightsAtTime.nodes;

  if (!results) return [];

  const votes = results.map(vote => {
    const rankedChoiceOption = parseRankedChoiceRawOptionId(vote.optionIdRaw);

    return {
      ...vote,
      rankedChoiceOption
    };
  });

  return votes.sort((a, b) => (new BigNumber(a.mkrSupport).lt(new BigNumber(b.mkrSupport)) ? 1 : -1));
}
