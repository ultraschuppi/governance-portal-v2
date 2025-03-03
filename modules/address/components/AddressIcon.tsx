import { Box } from 'theme-ui';
import Davatar from 'lib/davatar';
import { useDelegateAddressMap } from 'modules/delegates/hooks/useDelegateAddressMap';
import { DelegatePicture } from 'modules/delegates/components';

export default function AddressIcon({
  address,
  width = 22
}: {
  address: string;
  width?: number;
}): React.ReactElement {
  const { data: delegateAddresses } = useDelegateAddressMap();

  return (
    <Box sx={{ height: width, width: width }}>
      {delegateAddresses[address] ? (
        <DelegatePicture delegate={delegateAddresses[address]} width={width} />
      ) : (
        <Davatar size={width} address={address} />
      )}
    </Box>
  );
}
