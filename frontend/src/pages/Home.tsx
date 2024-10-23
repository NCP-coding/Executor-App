import HistoryWindow from '@/components/history/HistoryWindow';
import ExecutorList from '@/components/lists/ExecutorList';

const Home: React.FC = () => {
  return (
    <div className="flex h-full w-full">
        <aside className='w-1/3 bg-neutral-300 overflow-x-hidden resize-x'>
          <ExecutorList />
        </aside>

        {/* Rows */}        
        <div className='flex-grow p-1 bg-neutral-300 shadow-lg overflow-hidden'>
          <HistoryWindow/>
        </div>
    </div>
  );
};

export default Home;
