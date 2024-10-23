import React from 'react';
import { Flowbite} from 'flowbite-react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import ApiDisabledToast from './toast/FakeWarning';
import { useSettingsContext } from '@/context/SettingsContext';

interface LayoutProps {
  headerText: string;
}

const Layout: React.FC<LayoutProps> = ({
    headerText
}) => {
    const {apiCallsEnabled} = useSettingsContext();

    return (
        <Flowbite>
            <div className='flex flex-col h-screen'>
                { !apiCallsEnabled && <ApiDisabledToast/> }
                <Header text={headerText}/>

                {/* Main Content */}
                <main className='flex-grow overflow-hidden'>
                    <Outlet/>
                </main>
                <Footer className='flex justify-between'/>
            </div>
        </Flowbite>
    );
};

export default Layout;
