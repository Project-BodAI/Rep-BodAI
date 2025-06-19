// hooks/useMembership.ts
import { useAccount, useReadContract } from 'wagmi'
import { Address } from 'viem'

const MEMBERSHIP_CONTRACT_ADDRESS = process.env.REACT_APP_MEMBERSHIP_CONTRACT_ADDRESS as Address

const MEMBERSHIP_ABI = [
  {
    name: 'isMember',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

export function useMembership() {
  const { address, isConnected } = useAccount()
  
  const { data: isMember, isLoading, error } = useReadContract({
    address: MEMBERSHIP_CONTRACT_ADDRESS,
    abi: MEMBERSHIP_ABI,
    functionName: 'isMember',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address, // Sadece cüzdan bağlıyken çalışsın
    }
  })

  return { 
    isMember: isMember ?? false, // undefined durumunda false dönsün
    isLoading: isLoading && isConnected,
    isConnected,
    address,
    error
  }
}

// Üyelik durumunu kontrol eden helper hook
export function useMembershipStatus() {
  const { isMember, isLoading, isConnected, address } = useMembership()
  
  if (!isConnected) {
    return {
      status: 'disconnected',
      message: 'Connect your wallet.',
      canPurchase: false
    }
  }
  
  if (isLoading) {
    return {
      status: 'loading',
      message: 'Üyelik durumu kontrol ediliyor...',
      canPurchase: false
    }
  }
  
  if (isMember) {
    return {
      status: 'member',
      message: 'You are an active member!',
      canPurchase: false
    }
  }
  
  return {
    status: 'not-member',
    message: 'You are not a member!',
    canPurchase: true
  }
}