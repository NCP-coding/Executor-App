import React from 'react';
import { FaRegHourglass, FaCheckCircle, FaLock, FaBan, FaQuestionCircle, FaExclamationTriangle } from 'react-icons/fa';

interface StatusProps {
    status: 'STARTING' | 'ONLINE' | 'SHUTDOWN' | 'OFFLINE' | 'UNKNOWN' | 'ERROR_INTERNAL';
}

const StatusDisplay: React.FC<StatusProps> = ({ status }) => {
    let icon;
    let color;


    switch (status) {
        case 'STARTING':
            icon = <FaRegHourglass className='text-yellow-500' />;
            color = 'text-yellow-500';
            break;
        case 'ONLINE':
            icon = <FaCheckCircle className='text-green-500' />;
            color = 'text-green-500';
            break;
        case 'SHUTDOWN':
            icon = <FaLock className='text-red-500' />;
            color = 'text-red-500';
            break;
        case 'OFFLINE':
            icon = <FaBan className='text-gray-500' />;
            color = 'text-gray-500';
            break;
        case 'UNKNOWN':
            icon = <FaQuestionCircle className='text-gray-600' />;
            color = 'text-gray-600';
            break;
        case 'ERROR_INTERNAL':
            icon = <FaExclamationTriangle className='text-red-700' />;
            color = 'text-red-700';
            break;
        default:
            icon = <FaExclamationTriangle className='text-yellow-500' />;
            color = 'text-yellow-500';
            break;
    }

    return (
        <div className={`flex items-center ${color} p-1`}>
            <span className='text-sm mr-2'>{icon}</span>
            <span className='text-md'>{status}</span>
        </div>
    );
};

export default StatusDisplay;
