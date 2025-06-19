// config/web3.ts
import { createWeb3Modal } from '@web3modal/wagmi'
import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, polygon } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

const projectId = 'YOUR_PROJECT_ID' // WalletConnect'ten alın

const metadata = {
  name: 'Your App',
  description: 'Web3 Membership App',
  url: 'https://yourapp.com',
  icons: ['https://yourapp.com/icon.png']
}

const config = createConfig({
  chains: [mainnet, arbitrum, polygon],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})

createWeb3Modal({
  wagmiConfig: config,
  projectId
})

export { config }