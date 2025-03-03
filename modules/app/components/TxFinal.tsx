import { Button, Flex, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import TxIndicators from 'modules/app/components/TxIndicators';
import { Transaction, TXMined } from 'modules/web3/types/transaction';
import { useActiveWeb3React } from 'modules/web3/hooks/useActiveWeb3React';
import { getEtherscanLink } from 'modules/web3/helpers/getEtherscanLink';
import { ExternalLink } from 'modules/app/components/ExternalLink';

export const TxFinal = ({
  title,
  description,
  buttonLabel,
  onClick,
  tx,
  success,
  children
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  tx: Transaction;
  success: boolean;
  children?: React.ReactNode;
}): React.ReactElement => {
  const { network } = useActiveWeb3React();

  return (
    <Flex sx={{ flexDirection: 'column', textAlign: 'center' }}>
      <Text variant="microHeading" color="onBackgroundAlt">
        {title}
      </Text>
      {success ? (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
          <TxIndicators.Success sx={{ width: 6 }} />
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
          <TxIndicators.Failed sx={{ width: 6 }} />
        </Flex>
      )}
      <Text sx={{ color: 'secondaryEmphasis', mt: 3 }}>{description}</Text>
      {children}
      <ExternalLink
        href={getEtherscanLink(network, (tx as TXMined).hash, 'transaction')}
        styles={{ my: 3 }}
        title="View on etherscan"
      >
        <Text mt={3} px={4} sx={{ textAlign: 'center', fontSize: 14, color: 'accentBlue' }}>
          View on Etherscan
          <Icon name="arrowTopRight" pt={2} color="accentBlue" />
        </Text>
      </ExternalLink>
      <Button data-testid="txfinal-btn" onClick={onClick} sx={{ width: '100%', mt: 3 }}>
        {buttonLabel}
      </Button>
    </Flex>
  );
};
