import { Card } from 'flowbite-react';

const About: React.FC = () => {
  return (
<div className='flex justify-center items-center h-full bg-gray-100 p-5'>
  <Card className='max-w-lg w-full bg-white p-5 my-2 rounded-lg shadow-lg'>
    <h1 className='text-3xl font-bold mb-3'>About Me</h1>
    <div className='overflow-auto max-h-[60vh]'>
      <section className='mb-6'>
        <h2 className='text-2xl font-semibold mb-2'>Overview</h2>
        <p className='text-gray-700'>
          Hello, and welcome to my project portfolio!
        </p>
        <p className='text-gray-700'>
          I’m passionate about software development, and my work here is a testament to my dedication and expertise in both front-end and back-end development. This project, designed to send commands to a fleet of hosts, is an excellent example of my skills and experience.
        </p>
      </section>
      
      <section className='mb-6'>
        <h2 className='text-2xl font-semibold mb-2'>Why This Project?</h2>
        <p className='text-gray-700'>
          I chose this project because it perfectly encapsulates the challenges and solutions associated with managing distributed systems—a critical skill set in today's tech landscape. Here’s why:
        </p>
        <ul className='list-disc list-inside text-gray-700 pl-4'>
          <li><strong>Complex Problem-Solving</strong>: Developing a system that sends commands to multiple hosts requires meticulous planning and execution. This project showcases my ability to handle complex problems and create efficient, scalable solutions.</li>
          <li><strong>Full-Stack Proficiency</strong>: By integrating both front-end and back-end technologies, this project demonstrates my versatility. Whether it's crafting user-friendly interfaces or building robust server-side functionalities, I excel at both.</li>
          <li><strong>Real-World Relevance</strong>: Command and control systems are vital in various industries, from IT management to IoT. This project highlights my understanding of real-world applications and my ability to create impactful tools.</li>
        </ul>
      </section>
    </div>
  </Card>
</div>


  );
};

export default About;
