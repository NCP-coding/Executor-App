import { ListExecutorsResponse, RemoteExecuteCmdRequest, RemoteExecuteCmdResponse } from "@/api/types/shortcuts";
import { getRandomElement, MOCKED_CMD_RESPONSES, MOCKED_EXECUTOR_RESPONSE } from "@/data/Mock";

export const fetchCmdResponseData = async (allowApiCalls: boolean, cmdRequest: RemoteExecuteCmdRequest, url: string) => { 
    if(!allowApiCalls){            
        return { data: getRandomElement(MOCKED_CMD_RESPONSES), error: null};
    }

    try {
        const response = await fetch(`${url}/v1/cmd`, {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cmdRequest)
        });
        if (!response.ok) throw new Error('Failed to send request');

        const data: RemoteExecuteCmdResponse  = await response.json() ;
        return { data: data, error: null};
    } catch (error) {  
        return  { data: null, error };
    }
};

export const fetchExecutorListResponseData = async (allowApiCalls: boolean, url: string) => {
    if (!allowApiCalls) {
        return { data: MOCKED_EXECUTOR_RESPONSE, error: null };
    }

    try {
    const response = await fetch(`${url}/v1/executors`, {
        method: 'GET',
        credentials: 'omit',
    });
    if (!response.ok) throw new Error('Failed to send request');

    const data: ListExecutorsResponse = await response.json();
        return { data: data.executors, error: null }; 
    } catch (error) {
        return { data: null, error };
    }
};  