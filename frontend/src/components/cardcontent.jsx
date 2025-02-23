import React from 'react'

const Cardcontent = () => {
  return (
    <div className="flex items-center gap-4">
            {icon && <div className="text-3xl">{icon}</div>}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
        </div>
  )
}

export default Cardcontent