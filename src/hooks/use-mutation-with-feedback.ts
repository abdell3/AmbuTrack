import { useCallback } from "react"
import { useNotifications } from "@/contexts/NotificationContext"
import { UseMutationResult } from "@tanstack/react-query"

interface MutationFeedbackOptions {
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  errorMessage?: string
  showSuccess?: boolean
  showError?: boolean
  onSuccess?: (data: TData) => void
}

export function useMutationWithFeedback<TData, TError, TVariables, TContext>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>,
  options: MutationFeedbackOptions = {}
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
