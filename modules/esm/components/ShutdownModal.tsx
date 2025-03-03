import { Flex, Button, Text, Grid, Close, Spinner } from 'theme-ui';
import { useState } from 'react';
import { formatValue } from 'lib/string';
import { Icon } from '@makerdao/dai-ui-icons';
import { getEtherscanLink } from 'modules/web3/helpers/getEtherscanLink';
import { TXMined } from 'modules/web3/types/transaction';
import { BigNumber } from 'ethers';
import { useActiveWeb3React } from 'modules/web3/hooks/useActiveWeb3React';
import { useEsmShutdown } from '../hooks/useEsmShutdown';
import { ExternalLink } from 'modules/app/components/ExternalLink';

const ModalContent = ({
  setShowDialog,
  thresholdAmount
}: {
  setShowDialog: (value: boolean) => void;
  thresholdAmount?: BigNumber;
}): React.ReactElement => {
  const [step, setStep] = useState('default');
  const { network } = useActiveWeb3React();
  const { shutdown, tx } = useEsmShutdown();

  const close = () => {
    setShowDialog(false);
  };

  const DefaultScreen = () => (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Close onClick={() => setShowDialog(false)} sx={{ alignSelf: 'flex-end' }} />
      <Icon ml={2} name="warning" size={5} sx={{ color: 'notice' }} />
      <Text variant="heading" mt={4}>
        Shutting down the Dai Credit System
      </Text>
      <Text variant="text" sx={{ mt: 3 }}>
        The {thresholdAmount ? `${formatValue(thresholdAmount)}` : '---'} MKR limit for the emergency shutdown
        module has been reached. By continuing past this alert, emergency shutdown will be initiated for the
        Dai Credit System.
      </Text>
      <Grid columns={2} mt={4}>
        <Button
          onClick={close}
          variant="outline"
          sx={{ color: '#9FAFB9', borderColor: '#9FAFB9', borderRadius: 'small' }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            shutdown({
              initialized: () => setStep('signing'),
              pending: () => setStep('pending'),
              mined: () => close(), // TBD maybe show a separate "done" dialog,
              error: () => setStep('failed')
            });
          }}
          variant="outline"
          sx={{ color: 'onNotice', borderColor: 'notice', borderRadius: 'small' }}
        >
          Continue
        </Button>
      </Grid>
    </Flex>
  );

  const ShutdownSigning = () => (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Close
        aria-label="close"
        sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }}
        onClick={close}
      />

      <Text variant="heading" sx={{ fontSize: 6 }}>
        Sign TX to start Emergency Shutdown.
      </Text>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Spinner size="60px" sx={{ color: 'primary', alignSelf: 'center', my: 4 }} />
        <Text sx={{ color: 'onSecondary', fontWeight: 'medium', fontSize: 3 }}>
          Please use your wallet to sign this transaction.
        </Text>
        <Button onClick={close} variant="textual" sx={{ mt: 3, color: 'muted', fontSize: 2 }}>
          Cancel shutdown submission
        </Button>
      </Flex>
    </Flex>
  );

  const ShutdownPending = () => (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Close
        aria-label="close"
        sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }}
        onClick={close}
      />

      <Text variant="heading" sx={{ fontSize: 6 }}>
        Transaction Sent!
      </Text>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Icon name="reviewCheck" size={5} sx={{ my: 4 }} />
        <Text sx={{ color: 'onSecondary', fontWeight: 'medium', fontSize: '16px', textAlign: 'center' }}>
          Shutdown will update once the transaction has been confirmed.
        </Text>
        <ExternalLink
          href={getEtherscanLink(network, (tx as TXMined).hash, 'transaction')}
          styles={{ p: 0 }}
          title="View on etherscan"
        >
          <Text mt={3} px={4} sx={{ textAlign: 'center', fontSize: 14, color: 'accentBlue' }}>
            View on Etherscan
            <Icon name="arrowTopRight" pt={2} color="accentBlue" />
          </Text>
        </ExternalLink>
        <Button
          onClick={close}
          sx={{ mt: 4, borderColor: 'primary', width: '100%', color: 'primary' }}
          variant="outline"
        >
          Close
        </Button>
      </Flex>
    </Flex>
  );

  const ShutdownFailed = () => (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Close
        aria-label="close"
        sx={{ height: '20px', width: '20px', p: 0, alignSelf: 'flex-end' }}
        onClick={close}
      />
      <Text variant="heading" sx={{ fontSize: 6 }}>
        Transaction Failed.
      </Text>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Icon name="reviewFailed" size={5} sx={{ my: 3 }} />
        <Text sx={{ color: 'onSecondary', fontWeight: 'medium', fontSize: '16px' }}>
          Something went wrong with your transaction. Please try again.
        </Text>
        <Button
          onClick={close}
          sx={{ mt: 5, borderColor: 'primary', width: '100%', color: 'primary' }}
          variant="outline"
        >
          Close
        </Button>
      </Flex>
    </Flex>
  );

  switch (step) {
    case 'default':
      return <DefaultScreen />;
    case 'signing':
      return <ShutdownSigning />;
    case 'pending':
      return <ShutdownPending />;
    case 'failed':
      return <ShutdownFailed />;
    default:
      return <DefaultScreen />;
  }
};

export default ModalContent;
