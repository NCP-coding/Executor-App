import ResponseTable from '@/components/tables/ResponseTable';
import Donut from '@/components/charts/Donut';

import {MessageComponentMap} from './HistoryWindow'

const renderDisplayError = (text:string = 'Display Error') =>{
    return (
      <div className='flex justify-center mb-4 bg-red-300'>
        {text}
      </div>
    );
};

const defaultConfig: MessageComponentMap = {
    author: (props) => {
        const message = props.message;        
        if (message.text == undefined) 
            return renderDisplayError();
        
        return (
            <div className='flex justify-end mb-4'>
                <div className='p-2 max-w-xs rounded-lg bg-blue-500 text-white'>
                    {message.text}
                </div>
            </div>
        );
    },
    recipient: (props) => {
        const message = props.message;
        if (message.text == undefined) 
            return renderDisplayError();

        return (
            <div className='flex justify-start mb-4'>
                <div className='p-2 max-w-xs rounded-lg bg-gray-300 text-black'>
                    {props.message.text}
                </div>
            </div>
        );
    },
    cmdRequest: (props) => {
        const request = props.message.cmdRequest;        
        if (request == undefined) 
            return renderDisplayError();

        return (
            <div className='flex justify-end mb-4'>
                <div className='p-2 max-w-xs rounded-lg bg-blue-500 text-white'>
                    <span className='font-bold'>{request.cmd?.name}{' '}</span>{request.cmd?.args?.join(' ')}
                </div>
            </div>
        );
    },
    cmdResponse: (props) => {
        const response = props.message.cmdResponse;
        if (response == undefined || response.response == undefined)
            return renderDisplayError();

        const totalResponses = response.response.length; 
        const successfulResponses = response.response.filter((item) => item.code == 'OK').length;
        const failedResponses = totalResponses - successfulResponses;

        const labels = response.response.length > 0? Object.keys(response.response[0]): [];
        return (
            <div className='flex flex-col justify-start mb-4'>
                <div className='max-w-xs bg-gray-300 text-black'> 
                    <Donut data={[successfulResponses, failedResponses]} labels={['Pass', 'Fail']}/>
                </div>
                <ResponseTable className='min-w-[20rem] max-w-max dark:bg-grey-300'
                    labels={labels}
                    data={response.response}
                    />
            </div>
        );
    },
    error: (props) => {
        return renderDisplayError(props.message?.text);
    }
};

export default defaultConfig;