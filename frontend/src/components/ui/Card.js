import React from 'react'

const Card = ({price , lowBetter = false , title , icon , newData , oldData}) => {
    const calculatePercentageDifference = (oldData, newData) => {
        const difference = newData - oldData;
        const percentage = ((difference / oldData) * 100).toFixed(2);
        return `${percentage > 0 ? '+' : ''}${percentage}%`;
    };

    const percentage = calculatePercentageDifference(oldData, newData);
    let isPositive = parseFloat(percentage) > 0;

    if(lowBetter) {
        isPositive = true;
    }

    return (
        <div>
            <div className='flex items-center justify-between bg-blue-500 py-5 pl-3 rounded-t-[12px]'>
                <h4 className='font-bold text-white'>{title}</h4>
                <i className={`fas fa-${icon} text-white mr-4`}></i>
            </div>
            <div className='bg-white'>
                <div className='flex items-center'>
                    <div className={`${isPositive ? "bg-[#54CC96]" : "bg-[#FF5560]"} rounded-full text-white font-bold px-2 mt-4 ml-3`}>
                        {percentage} <i className={`fa-solid fa-arrow-${isPositive ? "up" : "down"}`}></i>
                    </div>
                    <p className='ml-5 mt-4'>From previous period</p>
                </div>
                <hr className='bg-gray-400 pt-[1px] my-5 w-[90%] mx-auto' />
                <div className='flex items-center justify-between w-[90%] mx-auto pb-[16px]'>
                    <p className='text-gray-600 font-bold'>
                        {newData} {price} <i className={`fa-solid fa-arrow-${isPositive ? "up" : "down"} text-${isPositive ? "[#54CC96]" : "[#FF5560]"}`}></i>
                    </p>
                    <p className='font-bold text-gray-600'>Last : {oldData} {price}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;
