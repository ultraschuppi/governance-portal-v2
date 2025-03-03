import { Poll, PartialPoll } from '../types/poll';

import { backoffRetry, timeoutPromise } from 'lib/utils';
import matter from 'gray-matter';
import { parsePollMetadata } from '../helpers/parsePollMetadata';
import logger from 'lib/logger';

async function fetchPollGithubDocument(url: string): Promise<string> {
  const document = await timeoutPromise(
    5000, // reject if it takes longer than this to fetch
    backoffRetry(3, () => fetch(url))
  ).then(resp => resp?.text());

  if (!(document.length > 0 && Object.keys(matter(document).data?.options)?.length > 0)) {
    throw new Error('Invalid poll document');
  }

  return document;
}

// Fetches poll metadata and returns null if it's invalid
export async function fetchPollMetadata(p: PartialPoll): Promise<Poll | null> {
  const document = await fetchPollGithubDocument(p.url);
  const poll = await parsePollMetadata(p, document);

  // If incorrect data, return null
  if (!poll || !poll.summary || !poll.options) {
    logger.error(`fetchPollMetadata: Poll ${p.pollId} incorrect data `);
    return null;
  }

  // If the poll hasn't started yet return null
  if (new Date(poll.startDate).getTime() > Date.now()) {
    logger.error(`fetchPollMetadata: Poll ${p.pollId} hasn't started yet.`);

    return null;
  }

  return poll;
}
