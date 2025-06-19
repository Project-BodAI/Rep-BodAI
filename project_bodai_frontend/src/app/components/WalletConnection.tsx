// components/WalletConnection.tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Bağlı adres: {address}</p>
          <button onClick={() => disconnect()}>Bağlantıyı Kes</button>
        </div>
      ) : (
        <button onClick={() => open()}>Cüzdan Bağla</button>
      )}
    </div>
  )
}