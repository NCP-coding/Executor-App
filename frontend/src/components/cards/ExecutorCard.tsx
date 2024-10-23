import React, { useState } from 'react';
import { Card, Checkbox } from 'flowbite-react';
import { Executor } from '@/api/types/shortcuts';
import StatusDisplay from '@/components/status/StatusDisplay';
import { useUuidTagsContext } from '@/context/UuidTagsContext';

export interface ExecutorCardProps {
    executor: Executor;
}


const ExecutorCard: React.FC<ExecutorCardProps> = ({executor}) => {

  const {selectedUuids, setUuids} = useUuidTagsContext();

  const handleToggle = (uuid: string) => {
    setUuids((prevUuids = []) =>
      prevUuids.includes(uuid)? prevUuids.filter((id) => id !== uuid) :[...prevUuids, uuid]
    );
  };

  return (
    <Card className='rounded-lg flex flex-col flex-grow justify-left my-0.5 mx-1'>
      <div className='rounded-lg flex flex-row items-center h-full'>
        <Checkbox className='mr-4' onChange={() => handleToggle(executor.uuid?? '')} checked={selectedUuids?.includes(executor.uuid ?? '')}/>
        <img
          alt='Small image of a PC'
          src='public/compu.png'
          className='size-16 object-cover rounded-full shadow-lg mr-4'
        />
        
        <div className='flex flex-col justify-center flex-wrap'>
          <StatusDisplay status={executor.status!} />
          <p className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
          {executor.uuid}
          </p>
          <p className='font-sm text-gray-700 dark:text-gray-400'>
            {executor.ipAddr}
          </p>
          <div className='font-sm font-semibold dark:text-gray-400 flex flex-wrap'>
            {executor.tags?.map((val: string) => (
              <span key={val} className='text-gray-700 border rounded-full border-indigo-300 px-2 mr-2'>{val}</span>
            ))}
          </div>
        </div>
        
      </div>
    </Card>
  );
}

export default ExecutorCard;