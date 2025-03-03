import { render, screen } from '@testing-library/react';
import mockVote from 'modules/polling/api/mocks/vote.json';
import { PollVoteHistoryItem } from 'modules/polling/components/PollVoteHistoryItem';
import { PollVoteHistory } from 'modules/polling/types/pollVoteHistory';
import { PollInputFormat, PollResultDisplay, PollVictoryConditions } from 'modules/polling/polling.constants';
import { usePollTally } from '../../hooks/usePollTally';
jest.mock('../../hooks/usePollTally');

describe('Poll vote history item', () => {
  beforeAll(() => {
    (usePollTally as jest.Mock).mockReturnValue({
      tally: {
        rounds: 1,
        winner: 1,
        totalMkrParticipation: 70288.579356787892861292,
        results: [
          {
            firstChoice: 2.001309,
            transfer: 0,
            winner: false,
            eliminated: false
          },
          {
            firstChoice: 70286.578047787892861292,
            transfer: 0,
            winner: true,
            eliminated: false
          }
        ],
        numVoters: 13
      },
      mutate: () => null
    });
  });

  test('renders plurality vote type correctly', async () => {
    const vote = {
      ...mockVote,
      poll: {
        ...mockVote.poll,
        endDate: new Date(mockVote.poll.endDate),
        startDate: new Date(mockVote.poll.startDate),
        parameters: {
          inputFormat: PollInputFormat.singleChoice,
          resultDisplay: PollResultDisplay.singleVoteBreakdown,
          victoryConditions: [{ type: PollVictoryConditions.plurality }]
        }
      }
    };

    render(<PollVoteHistoryItem vote={vote as PollVoteHistory} />);

    // search page for query text
    await screen.findByText(/VOTED OPTION/);

    // look for discussion link
    await screen.findByText(/Discussion/);

    // look for vote graphic text
    await screen.findAllByText(/Yes/);
    await screen.findAllByText(/No/);
    await screen.findAllByText(/Abstain/);
  });

  test('renders ranked choice vote type correctly', async () => {
    const vote = {
      ...mockVote,
      poll: {
        ...mockVote.poll,
        parameters: {
          inputFormat: PollInputFormat.rankFree,
          resultDisplay: PollResultDisplay.instantRunoffBreakdown,
          victoryConditions: [
            {
              type: PollVictoryConditions.instantRunoff
            }
          ]
        }
      }
    };

    render(<PollVoteHistoryItem vote={vote as PollVoteHistory} />);

    // search page for query text
    await screen.findByText(/VOTED CHOICES/);

    // check plurality graphic doesn't exist
    const abstain = screen.queryByText(/Abstain/);
    expect(abstain).not.toBeInTheDocument();
  });
});
