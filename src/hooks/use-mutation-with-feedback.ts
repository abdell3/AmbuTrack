import { useCallback } from "react"
import { useNotifications } from "@/contexts/NotificationContext"

// Type helper for mutation result
type MutationResult<TData, TError, TVariables, TContext> = {
  mutate: (variables: TVariables, options?: unknown) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  reset: () => void
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  data: TData | undefined
  error: TError | null
  status: "idle" | "pending" | "error" | "success"
}

interface MutationFeedbackOptions<TData> {
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  errorMessage?: string
  showSuccess?: boolean
  showError?: boolean
  onSuccess?: (data: TData) => void
}

export function useMutationWithFeedback<TData, TError, TVariables, TContext>(
  mutation: MutationResult<TData, TError, TVariables, TContext>,
  options: MutationFeedbackOptions<TData> = {}
) {
  const {
    successTitle = "Opération réussie",
    successMessage,
    errorTitle = "Erreur",
    errorMessage = "Une erreur est survenue. Veuillez réessayer.",
    showSuccess = true,
    showError = true,
    onSuccess: onSuccessCallback,
  } = options

  const { showSuccess: showSuccessNotification, showError: showErrorNotification } =
    useNotifications()

  const execute = useCallback(
    async (variables: TVariables) => {
      try {
        const result = await mutation.mutateAsync(variables)
        if (showSuccess) {
          showSuccessNotification(successTitle, successMessage)
        }
        onSuccessCallback?.(result)
        return result
      } catch (error) {
        if (showError) {
          const errorMsg =
            error instanceof Error ? error.message : errorMessage
          showErrorNotification(errorTitle, errorMsg)
        }
        throw error
      }
    },
    [
      mutation,
      showSuccess,
      showError,
      successTitle,
      successMessage,
      errorTitle,
      errorMessage,
      showSuccessNotification,
      showErrorNotification,
      onSuccessCallback,
    ]
  )

  return {
    ...mutation,
    execute,
  }
}
