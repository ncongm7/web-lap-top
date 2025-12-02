import { useToast as useVueToast } from 'vue-toastification'

/**
 * Composable wrapper for vue-toastification
 */
export function useToast() {
  const toast = useVueToast()

  const showSuccess = (message) => {
    toast.success(message, {
      timeout: 3000,
      position: 'top-right',
    })
  }

  const showError = (message) => {
    toast.error(message, {
      timeout: 4000,
      position: 'top-right',
    })
  }

  const showWarning = (message) => {
    toast.warning(message, {
      timeout: 3500,
      position: 'top-right',
    })
  }

  const showInfo = (message) => {
    toast.info(message, {
      timeout: 3000,
      position: 'top-right',
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toast, // Expose raw toast instance if needed
  }
}

