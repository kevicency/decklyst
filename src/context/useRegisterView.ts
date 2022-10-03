import { trpc } from '@/hooks/trpc'
import { useEffect } from 'react'

export const useRegisterView = (code: string) => {
  const { mutate: registerView } = trpc.deckviews.registerView.useMutation()

  useEffect(() => {
    registerView({ code })
  }, [code, registerView])
}
