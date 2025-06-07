import * as React from 'react'
import clsx from 'clsx'

interface InputErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string[] | string
}

export function InputError({ message, className, ...props }: InputErrorProps) {
  if (!message) return null

  const errorMessages = Array.isArray(message) ? message : [message]

  return (
    <div 
      data-slot="error" 
      className={clsx(className)}
      {...props}
    >
      {errorMessages.map((msg, index) => (
        <p
          key={index}
          className="text-base/6 text-red-600 mt-2 data-disabled:opacity-50 sm:text-sm/6 dark:text-red-500"
        >
          {msg}
        </p>
      ))}
    </div>
  )
}
