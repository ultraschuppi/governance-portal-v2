import create from 'zustand';
import invariant from 'tiny-invariant';

import { parseTxError } from '../lib/errors';
import getMaker from '../lib/maker';
import TX from '../types/transaction';
import { TabsKeyboardActivation } from '@reach/tabs';

type Store = {
  transactions: { [from: string]: TX[] };
  initTx: (from: string, txObject: any, message: string | null) => void;
  setPending: (from: string, txObject: any) => void;
  setMined: (from: string, txObject: any) => void;
  setError: (from: string, txObject: any, error: { message: string }) => void;
  track: (tx: any, message: any, options: any) => object;
  getTransaction: (submittedAt: string | number) => any;
};

const [useTransactionsStore, transactionsApi] = create<Store>((set, get) => ({
  transactions: {},

  initTx: (from, txObject, message) => {
    const pastTxs = get().transactions[from];
    const submittedAt = txObject._timeStampSubmitted;
    const status = 'initialized';
    set({
      transactions: {
        [from]: (pastTxs || []).concat([
          {
            submittedAt,
            status,
            message,
            hash: null,
            error: null,
            errorType: null
          }
        ])
      }
    });
  },

  setPending: (from, txObject) => {
    const submittedAt = txObject._timeStampSubmitted;
    const status = 'pending';
    set(state => {
      const transaction = state.transactions[from].find(tx => tx.submittedAt === submittedAt);
      invariant(transaction, `Unable to find tx from ${from} submitted at ${submittedAt}`);
      transaction.status = status;
      transaction.hash = txObject.hash;
      return state;
    });
  },

  setMined: (from, txObject) => {
    const submittedAt = txObject._timeStampSubmitted;
    const status = 'mined';
    set(state => {
      const transaction = state.transactions[from].find(tx => tx.submittedAt === submittedAt);
      invariant(transaction, `Unable to find tx from ${from} submitted at ${submittedAt}`);
      transaction.status = status;
      return state;
    });
  },

  setError: (from, txObject, error) => {
    const submittedAt = txObject._timeStampSubmitted;
    const status = 'error';
    set(state => {
      const transaction = state.transactions[from].find(tx => tx.submittedAt === submittedAt);
      invariant(transaction, `Unable to find tx from ${from} submitted at ${submittedAt}`);
      const errorType = transaction.hash ? 'failed' : 'not sent';
      transaction.status = status;
      transaction.error = parseTxError(error.message);
      transaction.errorType = errorType;
      return state;
    });
  },

  track: async (tx, message = null, options = {}) => {
    return new Promise(async res => {
      const maker = await getMaker();
      maker.service('transactionManager').listen(tx, {
        initialized: ({ metadata: { action }, ...txObject }) => {
          const from = action.from
          res(txObject);
          get().initTx(from, txObject, message);
          options.initialized && options.initialized();
        },
        pending: ({ metadata: { action }, ...txObject }) => {
          const from = action.from;
          res(txObject);
          get().setPending(from, txObject);
          options.pending && options.pending();
        },
        mined: ({ metadata: { action }, ...txObject }) => {
          const from = action.from;
          res(txObject);
          get().setMined(from, txObject);
          options.mined && options.mined();
        },
        error: ({ metadata: { action }, ...txObject }, error) => {
          const from = action.from;
          res(txObject);
          get().setError(from, txObject, error);
          options.error && options.error(error);
        }
      });
    });

    // noop catch since we handle tx errors via the manager
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    tx.catch(() => {});
  },
  getTransaction: timeStampSubmitted => {
    return Object.values(get().transactions)
      .flat()
      .find(tx => tx.submittedAt === timeStampSubmitted);
  }
}));

export default useTransactionsStore;
export { transactionsApi };
