import React, { useEffect, useState } from 'react'
import { useNotification } from '../context/NotificationContext'

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entry animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  // Auto-hide if duration is set
  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration])

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'bg-green-100 text-green-600',
          progress: 'bg-green-500'
        }
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'bg-red-100 text-red-600',
          progress: 'bg-red-500'
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'bg-yellow-100 text-yellow-600',
          progress: 'bg-yellow-500'
        }
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'bg-blue-100 text-blue-600',
          progress: 'bg-blue-500'
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full
        transition-all duration-300 ease-out
        ${styles.container}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.icon}`}>
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium leading-snug">{notification.message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Bar */}
      {notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${styles.progress}`}
            style={{
              animation: `shrink ${notification.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  )
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
      <style>
        {`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
      <div className="pointer-events-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="mb-3">
            <NotificationItem notification={notification} onRemove={removeNotification} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationContainer
