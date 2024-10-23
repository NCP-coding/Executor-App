import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { Executor } from '@/api/types/shortcuts';
import ExecutorCard from '../cards/ExecutorCard';
import { useUuidTagsContext } from '@/context/UuidTagsContext';
import { useSettingsContext } from '@/context/SettingsContext';
import { MOCKED_EXECUTOR_RESPONSE } from '@/data/Mock';
import { fetchExecutorListResponseData } from '@/hooks/Fetch';


const ExecutorList: React.FC = () => {
    const { selectedTags,  setTags, setUuids} = useUuidTagsContext(); 
    const { apiCallsEnabled, backendUrl } = useSettingsContext();
    const [data, setData] = useState<Executor[]>(MOCKED_EXECUTOR_RESPONSE);
    const [loading, setLoading] = useState<boolean>(false);   
    
    const toggleTag = useCallback((tag: string) => { 
        setTags((prev = []) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    },[setTags]);

    const filteredCards = data.filter((card) =>
        (selectedTags ?? []).every((tag) => card.tags!.includes(tag))
    );
    const allFlags = Array.from(new Set([
        ...data.flatMap((card) => card.tags || []) 
    ]));

    useEffect(() => {
        setLoading(true);
        setData([]);
        fetchExecutorListResponseData(apiCallsEnabled, backendUrl)
        .then(({ data, error }) => {
            if (!error) {
                setData(data || []);
            } 
        }).finally(() => {
            setLoading(false);
        })
    },[apiCallsEnabled, backendUrl]);

    useEffect(() => {
        setUuids(data.flatMap((card) => card.uuid || []));
    }, [data, setUuids]);

    return (
        <div>
            {/* Tag filter Buttons */}
            <div className='sticky top-0 bg-neutral-50 dark:bg-gray-800 rounded-lg my-1.5 mx-1'>
                <div className='font-bold text-l ml-1.5'>Select tags</div>
                <div className='flex flex-wrap'>                
                    {allFlags.map((tag) => (
                        <Button
                            pill
                            size='xs'
                            key={tag}
                            className={`px-3 py-1.5 m-2 rounded-full border transition duration-200 ease-in-out 
                                ${(selectedTags ?? []).includes(tag!) 
                                    ? 'bg-blue-600 text-white border-transparent'  // Active state
                                    : 'bg-blue-300 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-blue-400'} // Inactive state
                                    `}
                            onClick={() => toggleTag(tag!)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>
            {
                loading &&  (
                    <div className='text-center mb-2'>
                        <div role='status'>
                            <svg aria-hidden='true' className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
                                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
                            </svg>
                            <span className='mx-2' >Waiting for response ...</span>
                        </div>
                    </div>
                )
            }

            <div className='flex flex-col gap-4 h-full'>
                {filteredCards.length > 0 ? (
                    filteredCards.map((card) => (
                        <ExecutorCard key={card.uuid} executor={card}/>                        
                    ))
                ) : (
                    <p>No cards match the selected tags.</p>
                )}
            </div>
        </div>
    );
};

export default ExecutorList;
