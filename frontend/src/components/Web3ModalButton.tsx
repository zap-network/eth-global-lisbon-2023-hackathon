import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import Web3Modal from 'web3modal';
import { Button } from 'nextui';

const Web3ModalButton = (): JSX.Element => {
  const { activate } = useWeb3React<Web3Provider>();

  const openWeb3Modal = async () => {
    const providerOptions = {};
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
    });
    const provider = await web3Modal.connect();
    activate(provider);
  };

  return (
    <Button onClick={openWeb3Modal}>Connect to Metamask</Button>
  );
};

const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const Web3ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <Web3ReactProvider getLibrary={getLibrary}>
    {children}
  </Web3ReactProvider>
);

export { Web3ModalButton, Web3ModalProvider };
