import { trpc } from '@/utils/trpc'
import { useEffect } from 'react'

export const useRegisterView = (
  sharecode: string | undefined,
  { enabled }: { enabled?: boolean } = {},
) => {
  const { mutate: registerView } = trpc.deckView.registerView.useMutation()

  useEffect(() => {
    if (sharecode && enabled !== false) {
      registerView({ sharecode })
    }
  }, [sharecode, registerView, enabled])
}
