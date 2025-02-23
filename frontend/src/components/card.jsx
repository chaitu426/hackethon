import React from 'react'

const Card = () => {
  return (
    
        <div className={`p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center gap-4 border-l-4 `}>
            
            <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
};
  


export default Card