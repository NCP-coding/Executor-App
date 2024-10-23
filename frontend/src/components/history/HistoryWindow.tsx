import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'flowbite-react';

import {RemoteExecuteCmdRequest, RemoteExecuteCmdResponse} from '@/api/types/shortcuts';
import defaultConfig from './config';
import { useUuidTagsContext } from '@/context/UuidTagsContext';
import { useSettingsContext } from '@/context/SettingsContext';
import { fetchCmdResponseData } from '@/hooks/Fetch';

export interface Message {
    type: string;
    text?: string;

    cmdRequest?: RemoteExecuteCmdRequest;
    cmdResponse?: RemoteExecuteCmdResponse;
}
  
export type MessageComponentMap = {
    [key: string]: React.FC<{ message: Message }>;
};
  
const ChatMessage: React.FC<{ message: Message; config: MessageComponentMap }> = ({ message, config }) => {
    const Component = config[message.type];
    if (Component) {
        return <Component message={message} />;
    } else {
        return null;
    }
};

const exampleData: Message[] = [
    { type: 'recipient', text: 'Hello there, feel free to check out my app💥!' },
    { type: 'recipient', text: 'Here is an example how a remote execution of a command would look like:' },
    { type: 'cmdRequest', cmdRequest: { cmd: { name: 'sudo', args: ['apt-get', 'update'], waitForFinish: true } } },
    { type: 'cmdResponse', cmdResponse: { response: [
        { uuid: '123', code: 'OK', message: 'Fetched 13.4 MB in 6s (2412 kB/s)\nReading package lists... Done\n' },
        { uuid: '124', code: 'ERROR', message: 'No response from executor received' }
    ]}}
];

const HistoryWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(exampleData);

    const {selectedTags,  selectedUuids} = useUuidTagsContext();   
    const {apiCallsEnabled, backendUrl} = useSettingsContext();

    const [inputText, setInputText] = useState('');
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const scrollToBottom = useCallback(() => {
        if (!chatBoxRef.current) 
            return;
        
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const scrollToBottomAfterRender = () => {
            setTimeout(() => {
                scrollToBottom();
            }, 0); // Delay to ensure DOM is updated
        };
    
        scrollToBottomAfterRender();
    }, [messages, scrollToBottom]);

    const sendMessage = useCallback(async () => {
        if(!inputText.trim())
            return;

        const [cmdName, ...cmdArgs] = inputText.trim().split(/\s+/);
        
        const cmdRequest: RemoteExecuteCmdRequest =  {
            uuids: selectedUuids, 
            tags: selectedTags,
            cmd: { name: cmdName, args: cmdArgs, waitForFinish: true }
        };
        setMessages(prev => [
            ...prev, 
            { type: 'cmdRequest', cmdRequest }
        ]);
        setInputText(''); 
        setLoading(true);

        const {data, error} = await fetchCmdResponseData(apiCallsEnabled, cmdRequest, backendUrl);
        
        if(error) {
            setMessages(prev => [
                ...prev,
                { type: 'error', text: `${error}` }
            ]);
        } else {
            setMessages(prev => [
                ...prev,
                { type: 'cmdResponse', cmdResponse: data || undefined }
            ]);
        }
        setLoading(false);
            
    }, [inputText, selectedUuids, selectedTags, backendUrl, apiCallsEnabled]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter')
            sendMessage();
    },[sendMessage]);

    return (
        <div className='flex flex-col h-full w-full p-4 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white'>
            <div ref={chatBoxRef} className='chat-box flex-grow overflow-auto p-4 rounded-lg mb-4 h-80'>
                {messages.map((message, index) => (
                    <ChatMessage key={index} config={defaultConfig} message={message} />
                ))}
            </div>
            {loading && (
                <div className='text-center mb-2'>
                    <div role='status'>
                        <svg aria-hidden='true' className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
                            <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
                        </svg>
                        <span className='mx-2' >Waiting for response ...</span>
                    </div>
                </div>
            )}
            <div className='flex'>
                <input
                type='text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown} 
                className='flex-grow p-2 border rounded-lg mr-2'
                placeholder='Type your command...'
                />
                <Button gradientDuoTone='purpleToBlue' size='sm' className='flex-wrap' onClick={sendMessage}>
                    Send to fleet
                </Button>
            </div>
        </div>
    );
};

export default HistoryWindow;