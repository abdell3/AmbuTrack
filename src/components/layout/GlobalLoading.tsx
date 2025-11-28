import { useIsFetching, useIsMutating } from "@tanstack/react-query"
import { Loading } from "@/components/ui/loading"

export function GlobalLoading() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  // Only show global loading for mutations, not queries
  if (isMutating > 0) {
    return (
      <Loading
        fullScreen
        text="Traitement en cours..."
        size="lg"
      />
    )
  }

  return null
}

