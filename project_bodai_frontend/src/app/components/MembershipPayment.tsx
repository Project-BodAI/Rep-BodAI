// components/MembershipPayment.tsx
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Address } from 'viem'
import { useMembershipStatus } from '../hooks/useMembership'

const MEMBERSHIP_CONTRACT_ADDRESS = process.env.REACT_APP_MEMBERSHIP_CONTRACT_ADDRESS as Address
const MEMBERSHIP_PRICE = '0.01' // ETH cinsinden fiyat

const MEMBERSHIP_ABI = [
  {
    name: 'purchaseMembership',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
] as const

export function MembershipPayment() {
  const { address, isConnected } = useAccount()
  const { status, message, canPurchase } = useMembershipStatus()
  const [isLoading, setIsLoading] = useState(false)
  
  const { writeContract, data: hash, error: writeError } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handlePayment = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first.')
      return
    }
    
    setIsLoading(true)
    
    try {
      writeContract({
        address: MEMBERSHIP_CONTRACT_ADDRESS,
        abi: MEMBERSHIP_ABI,
        functionName: 'purchaseMembership',
        value: parseEther(MEMBERSHIP_PRICE),
      })
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred while processing your payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="membership-payment">
      <h3>Membership Payment</h3>
      <p>Fiyat: {MEMBERSHIP_PRICE} ETH</p>
      <p>Durum: {message}</p>
      
      {canPurchase && (
        <button 
          onClick={handlePayment}
          disabled={isLoading || isConfirming || !isConnected}
          className="payment-button"
        >
          {isLoading || isConfirming ? 'Processing...' : 'Purchase Membership'}
        </button>
      )}
      
      {writeError && (
        <p style={{ color: 'red' }}>
          Hata: {writeError.message}
        </p>
      )}
      
      {isSuccess && (
        <p style={{ color: 'green' }}>
          Payment successful! Transaction hash: {hash}
        </p>
      )}
    </div>
  )
}