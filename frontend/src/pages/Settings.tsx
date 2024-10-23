import { useSettingsContext } from '@/context/SettingsContext';
import { Card, Button, TextInput, Label, ToggleSwitch, Toast  } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { HiCheck } from "react-icons/hi";
const Settings: React.FC = () => {
  const {
    apiCallsEnabled, setApiCallsEnabled,
    backendUrl, setBackendUrl

  } = useSettingsContext();

  const [saved, setSaved] = useState(false);
  const [inputUrl, setInputUrl] = useState(backendUrl || ''); 

  const inputUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setSaved(false);
  }, []);

  const saveUrl = useCallback(() => {
    setBackendUrl(inputUrl);
    setSaved(true);
  }, [inputUrl, setBackendUrl, setSaved]);

  return (
    <div className='flex justify-center items-center'>
      <Card className='max-w-md mx-auto bg-white my-2 rounded-lg shadow-lg flex flex-col justify-center'>
        <h1 className='text-3xl font-bold mb-3'>Settings</h1>
        <div>
          <div className="block">
            <Label  
              className='font-bold'
              value='Backend URL:'
              htmlFor='url'/>
          </div>
          <TextInput
            id='url'
            type='text'
            placeholder={inputUrl}
            className='mt-1'
            onChange={inputUpdate} required
          />
          <ToggleSwitch className='mt-4 focus:ring-blue-500' checked={apiCallsEnabled} label="Enable API calls" onChange={setApiCallsEnabled} />
          <Button className='w-full mt-4 shadow-lg' onClick={saveUrl}>Save</Button>
          { saved && 
            <Toast className='fixed top-5 right-5 z-50'>              
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{inputUrl} saved successfully.</div>
              <Toast.Toggle />
            </Toast>
          }
        </div>
      </Card>
    </div>
  );
};

export default Settings;
