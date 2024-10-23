
import { Toast } from 'flowbite-react';
import React from 'react';
import { HiInformationCircle  } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

const ApiDisabledToast: React.FC = () => {
  return (
    <Toast className='fixed top-5 right-5 z-50 bg-blue-100'>
        <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-400 text-blue-900 dark:bg-blue-600 dark:text-blue-200'>
            <HiInformationCircle className='h-5 w-5' />
        </div>
        <div className='ml-3 text-sm font-normal text-blue-900 dark:text-blue-200'>
            <p className='font-semibold'>Info</p>
            API calls are currently disabled, go to
            <NavLink to='/settings' className='text-blue-600 px-2'>settings</NavLink>
            to enable them. 
            <p className='italic mt-2'>This was done so that the front end can be tested without a working back end.</p>
        </div>
        <Toast.Toggle />
    </Toast>
  );
}

export default ApiDisabledToast;