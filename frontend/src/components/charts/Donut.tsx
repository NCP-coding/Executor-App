import React from 'react';
import Chart from 'react-apexcharts';

interface DonutProps {
  data: number[];
  labels: string[];
}

const Donut: React.FC<DonutProps> = ({ data, labels }) => {
  const options = {        
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
        }, 
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
              formatter: function (val: any) {
                return val
              }
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val: string) {
                return val
              }
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: '#373d3f'
            }
          }
        },      
      }
    },
    legend: {
      show: true,
      onItemHover: {
        highlightDataSeries: false, // this fixes this weird wtf hover over issue !!
      },
    },
    labels: labels,
    colors: ['#6EE7B7','#F87171'], 
  }

  return (
    <div className='donut w-auto'>
      <Chart options={options} series={data} type='donut' />
    </div>
  );
}

export default Donut;