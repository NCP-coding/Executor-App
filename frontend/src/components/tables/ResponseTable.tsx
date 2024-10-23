import {Table} from 'flowbite-react';
import React from 'react';

interface ResponseTableProps {
  className?: string;
  labels?: string[];
  data?: { [key: string]: string }[];
}

const ResponseTable: React.FC<ResponseTableProps> = ({className, labels, data}) => {
  return (
    <div className={`overflow-x-auto h-full bg-gray-300 ${className}`}>
      <Table hoverable>
        <Table.Head>
          {labels?.map((label, index)=>( 
            <Table.HeadCell key={index} className='bg-gray-300 text-black'>{label}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className='bg-gray-300'>
        {data?.map((row, rowIndex) => (
          <Table.Row key={rowIndex} className='dark:border-gray-700 dark:bg-gray-300'>
            {Object.entries(row).map(([_, value], cellIndex) => (
              <Table.Cell key={cellIndex}>
                {typeof value === 'string' && value.includes('\n') ? (
                  value.split('\n').map((line, lineIndex) => (
                    <div className='overflow-x-auto' key={`${cellIndex}-${lineIndex}`}>{line}</div>
                  ))
                ) : (
                  value
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    </div>
  );
}
export default ResponseTable;