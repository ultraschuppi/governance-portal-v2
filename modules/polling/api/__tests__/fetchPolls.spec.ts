import { getPolls, sortPolls } from '../fetchPolls';
import fs from 'fs';
import { config } from '../../../../lib/config';
import os from 'os';
import { Poll } from '../../types';
import { gqlRequest } from '../../../../modules/gql/gqlRequest';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { PollInputFormat, PollResultDisplay, PollVictoryConditions } from 'modules/polling/polling.constants';
import packageJSON from '../../../../package.json';

jest.mock('modules/gql/gqlRequest');

const cacheFile = `/${os.tmpdir()}/gov-portal-version-${packageJSON.version}-mainnet-polls-all-${new Date()
  .toISOString()
  .substring(0, 10)}`;

describe('Fetch poll', () => {
  beforeAll(() => {
    config.USE_CACHE = 'true';
    config.REDIS_URL = '';
    (gqlRequest as jest.Mock).mockResolvedValue({
      activePolls: {
        nodes: [],
        edges: []
      }
    });
  });

  afterAll(() => {
    config.USE_CACHE = '';
    if (fs.existsSync(cacheFile)) fs.unlinkSync(cacheFile);
  });

  test('getPolls with filesystem caching', async () => {
    jest.setTimeout(25000);
    await getPolls({}, SupportedNetworks.MAINNET);
    expect(fs.existsSync(cacheFile)).toBeTruthy();
  });
});

describe('Sort Polls', () => {
  const polls: Poll[] = [
    {
      tags: [
        {
          id: 'a',
          longname: 'a',
          shortname: 'a'
        }
      ],
      content: '',
      discussionLink: '',
      endDate: new Date(2011, 10, 30),
      multiHash: '',
      options: {},
      pollId: 1,
      startDate: new Date(2011, 10, 30),
      slug: '',
      summary: '',
      title: '2011,10,30',
      parameters: {
        inputFormat: PollInputFormat.singleChoice,
        resultDisplay: PollResultDisplay.singleVoteBreakdown,
        victoryConditions: [{ type: PollVictoryConditions.plurality }]
      },
      ctx: {} as any
    },
    {
      tags: [
        {
          id: 'a',
          longname: 'a',
          shortname: 'a'
        }
      ],
      content: '',
      discussionLink: '',
      endDate: new Date(2011, 10, 30),
      multiHash: '',
      options: {},
      pollId: 2,
      startDate: new Date(2011, 10, 31),
      slug: '',
      summary: '',
      title: '2011,10,31',
      parameters: {
        inputFormat: PollInputFormat.singleChoice,
        resultDisplay: PollResultDisplay.singleVoteBreakdown,
        victoryConditions: [{ type: PollVictoryConditions.plurality }]
      },
      ctx: {} as any
    },
    {
      tags: [
        {
          id: 'a',
          longname: 'a',
          shortname: 'a'
        }
      ],
      content: '',
      discussionLink: '',
      endDate: new Date(2021, 11, 31),
      multiHash: '',
      options: {},
      pollId: 3,
      startDate: new Date(2021, 10, 31),
      slug: '',
      summary: '',
      title: '2021,10,31',
      parameters: {
        inputFormat: PollInputFormat.singleChoice,
        resultDisplay: PollResultDisplay.singleVoteBreakdown,
        victoryConditions: [{ type: PollVictoryConditions.plurality }]
      },
      ctx: {} as any
    },
    {
      tags: [
        {
          id: 'a',
          longname: 'a',
          shortname: 'a'
        }
      ],
      content: '',
      discussionLink: '',
      endDate: new Date(2021, 11, 31),
      multiHash: '',
      options: {},
      pollId: 4,
      startDate: new Date(2021, 11, 31),
      slug: '',
      summary: '',
      title: '2021,11,31',
      parameters: {
        inputFormat: PollInputFormat.singleChoice,
        resultDisplay: PollResultDisplay.singleVoteBreakdown,
        victoryConditions: [{ type: PollVictoryConditions.plurality }]
      },
      ctx: {} as any
    }
  ];

  test('The first poll is the one created sooner', () => {
    const results = sortPolls(polls);

    expect(results[0].pollId).toEqual(4);
  });

  test('The second poll is the one with the same date as 1 but different start date', () => {
    const results = sortPolls(polls);

    expect(results[1].pollId).toEqual(3);
  });

  test('The 4 poll is the one that ended first', () => {
    const results = sortPolls(polls);

    expect(results[3].pollId).toEqual(1);
  });
});
