import { Executor, RemoteExecuteCmdResponse } from "@/api/types/shortcuts";

export const MOCKED_CMD_RESPONSES: RemoteExecuteCmdResponse[] = [
    {
        response: [
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120002', 
                code: 'OK',
                message: 'Command executed: sudo apt-get update. \nFetched 30,000 kB in 10s (3,000 kB/s)\nReading package lists... Done'
            },
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120003', 
                code: 'OK',
                message: 'Command executed: sudo apt-get upgrade. \nUpgrading 5 packages, 2 newly installed, 0 to remove and 0 not upgraded.'
            }
        ]
    },
    {
        response: [
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120004', 
                code: 'OK',
                message: 'Command executed: df -h. \nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       100G   40G   55G  42% /\ntmpfs           4.0G  8.0K  4.0G   1% /dev/shm'
            },
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120005', 
                code: 'ERROR',
                message: 'Command executed: apt-get upgrade. \nSome packages could not be upgraded. Please run apt-get dist-upgrade to fix.'
            }
        ]
    },
    {
        response: [
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120006', 
                code: 'ERROR',
                message: 'Command executed: ping google.com. \nping: google.com: Name or service not known'
            }
        ]
    },
    {
        response: [
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120007', 
                code: 'OK',
                message: 'Command executed: git status. \nOn branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'
            },
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120008', 
                code: 'OK',
                message: 'Command executed: git pull. \nAlready up to date.'
            }
        ]
    },
    {
        response: [
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120009', 
                code: 'OK',
                message: 'Command executed: ls -la. \ntotal 48\ndrwxr-xr-x  6 user user 4096 Oct 10 10:00 .\ndrwxr-xr-x  3 user user 4096 Oct  9 09:00 ..\n-rw-r--r--  1 user user  123 Oct 10 09:00 file1.txt\n-rw-r--r--  1 user user  456 Oct 10 09:30 file2.txt'
            },
            {
                uuid: 'a7d9c1b0-f65b-11ec-9b77-0242ac120010', 
                code: 'OK',
                message: 'Command executed: rm file2.txt. \nfile2.txt deleted.'
            }
        ]
    }
];

export const MOCKED_EXECUTOR_RESPONSE: Executor[] = [
    {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        ipAddr: '192.168.1.1',
        status: 'ONLINE', // Correctly typed as one of the allowed string literals
        tags: ['linux', 'x86', 'do not use', 'backup'],
    },
    {
        uuid: '123e4567-e89b-12d3-a456-426614174001',
        ipAddr: '192.168.1.2',
        status: 'SHUTDOWN', // Correctly typed as one of the allowed string literals
        tags: ['linux','arm', 'currently inactive'],
    },
    {
        uuid: '123e4567-e89b-12d3-a456-426614174002',
        ipAddr: '192.168.1.3',
        status: 'OFFLINE', // Correctly typed as one of the allowed string literals
        tags: ['linux','main'],
    },
    {
        uuid: '123e4567-e89b-12d3-a456-426614174003',
        ipAddr: '192.168.1.4',
        status: 'OFFLINE', // Correctly typed as one of the allowed string literals
        tags: ['linux','main'],
    }
  ];

export const getRandomElement = <T,>(array: T[]): T | undefined => {
    if (array.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
