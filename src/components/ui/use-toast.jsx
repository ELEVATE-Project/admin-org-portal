import * as React from 'react'
import { Toaster } from '@/components/ui/toaster'

const ToastContext = React.createContext({})

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = React.useState(null)

  const showToast = React.useCallback(options => {
    setToast(options)
  }, [])

  const dismissToast = React.useCallback(() => {
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, showToast, dismissToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export default useToast
