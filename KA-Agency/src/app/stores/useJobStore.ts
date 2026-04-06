import React, { createContext, useContext, useReducer } from 'react';

export type JobCategory = 'Cruise Ship' | 'Band' | 'Concert/Festival' | 'Stable' | 'Movie Project' | 'Live Recording' | 'Other';
export type JobStatus = 'open' | 'closed' | 'filled';
export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  rate: string;
  rateType: 'daily' | 'weekly' | 'monthly' | 'project';
  instruments: string[];
  genres: string[];
  levelRequired: number;
  status: JobStatus;
  postedAt: string;
  clientName: string;
  clientAvatar: string;
  applicants: number;
  slots: number;
}

export interface Application {
  id: string;
  jobId: string;
  musicianId: string;
  musicianName: string;
  musicianAvatar: string;
  instrument: string;
  level: number;
  status: ApplicationStatus;
  appliedAt: string;
  note: string;
}

interface JobState {
  jobs: Job[];
  applications: Application[];
  myApplicationIds: string[];
}

type JobAction =
  | { type: 'APPLY'; jobId: string }
  | { type: 'WITHDRAW'; jobId: string }
  | { type: 'UPDATE_APPLICATION'; id: string; status: ApplicationStatus }
  | { type: 'ADD_JOB'; job: Job }
  | { type: 'UPDATE_JOB_STATUS'; jobId: string; status: JobStatus };

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Resident Guitarist — MSC Cruise Lines',
    category: 'Cruise Ship',
    description: 'Seeking an experienced guitarist for a 6-month contract aboard MSC Virtuosa. You will perform nightly in the main lounge and collaborate with the resident band.',
    location: 'Mediterranean Route (Spain, Italy, Greece)',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    rate: 'USD 3,200',
    rateType: 'monthly',
    instruments: ['Guitar'],
    genres: ['Pop', 'Jazz', 'Latin'],
    levelRequired: 6,
    status: 'open',
    postedAt: '2026-03-10',
    clientName: 'MSC Cruises',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=msc',
    applicants: 12,
    slots: 2,
  },
  {
    id: 'j2',
    title: 'Keyboardist — Botswana International Music Festival',
    category: 'Concert/Festival',
    description: 'We need a keyboardist for the main stage performances at the annual BIMF. 3 rehearsals + 2 live performances.',
    location: 'Gaborone, Botswana',
    startDate: '2026-05-15',
    endDate: '2026-05-17',
    rate: 'BWP 8,000',
    rateType: 'project',
    instruments: ['Piano', 'Keyboard'],
    genres: ['Afrobeat', 'Gospel', 'Jazz'],
    levelRequired: 5,
    status: 'open',
    postedAt: '2026-03-12',
    clientName: 'BIMF Committee',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=bimf',
    applicants: 7,
    slots: 1,
  },
  {
    id: 'j3',
    title: 'Session Violinist — Film Score Recording',
    category: 'Movie Project',
    description: "Botswana's first major film production requires session violinists for the original score. 5-day recording session at Gaborone studios.",
    location: 'Gaborone Recording Studios',
    startDate: '2026-04-20',
    endDate: '2026-04-25',
    rate: 'BWP 2,500',
    rateType: 'daily',
    instruments: ['Violin'],
    genres: ['Orchestral', 'Classical'],
    levelRequired: 7,
    status: 'open',
    postedAt: '2026-03-15',
    clientName: 'Zebra Film Productions',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=zebra',
    applicants: 4,
    slots: 3,
  },
  {
    id: 'j4',
    title: 'Drummer — The Savanna Band (Touring)',
    category: 'Band',
    description: 'Southern Africa touring band needs a drummer for a 3-month tour covering Botswana, Zimbabwe, Zambia, and South Africa.',
    location: 'Southern Africa Tour',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    rate: 'BWP 15,000',
    rateType: 'monthly',
    instruments: ['Drums'],
    genres: ['Afrobeat', 'Reggae', 'Fusion'],
    levelRequired: 5,
    status: 'open',
    postedAt: '2026-03-08',
    clientName: 'The Savanna Band',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=savanna',
    applicants: 9,
    slots: 1,
  },
  {
    id: 'j5',
    title: 'Jazz Pianist — The Grand Palm Hotel',
    category: 'Stable',
    description: 'Ongoing contract for a jazz pianist to perform in The Grand Palm Hotel lobby lounge, Thursday to Sunday evenings.',
    location: 'The Grand Palm Hotel, Gaborone',
    startDate: '2026-04-01',
    rate: 'BWP 6,000',
    rateType: 'monthly',
    instruments: ['Piano'],
    genres: ['Jazz', 'Blues'],
    levelRequired: 6,
    status: 'open',
    postedAt: '2026-03-18',
    clientName: 'Grand Palm Hotel',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=palm',
    applicants: 5,
    slots: 1,
  },
  {
    id: 'j6',
    title: 'Backing Vocalist — Studio Album Recording',
    category: 'Live Recording',
    description: 'Professional backing vocalists needed for Mpho Tau\'s debut album. 8 tracks over 4 studio days.',
    location: 'Francistown Recording Studio',
    startDate: '2026-04-10',
    endDate: '2026-04-13',
    rate: 'BWP 1,800',
    rateType: 'daily',
    instruments: ['Voice'],
    genres: ['Gospel', 'Afropop'],
    levelRequired: 4,
    status: 'open',
    postedAt: '2026-03-20',
    clientName: 'Mpho Tau Music',
    clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=mpho',
    applicants: 11,
    slots: 4,
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    musicianId: 'mus-001',
    musicianName: 'Kagiso Sithole',
    musicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musician',
    instrument: 'Guitar',
    level: 7,
    status: 'shortlisted',
    appliedAt: '2026-03-11',
    note: 'I have 3 years of cruise ship experience and speak fluent English and Portuguese.',
  },
  {
    id: 'a2',
    jobId: 'j5',
    musicianId: 'mus-002',
    musicianName: 'Naledi Moremi',
    musicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=naledi',
    instrument: 'Piano',
    level: 8,
    status: 'pending',
    appliedAt: '2026-03-19',
    note: 'Jazz is my primary genre with 10 years hotel performance experience.',
  },
];

function jobReducer(state: JobState, action: JobAction): JobState {
  switch (action.type) {
    case 'APPLY':
      return {
        ...state,
        myApplicationIds: [...state.myApplicationIds, action.jobId],
        jobs: state.jobs.map(j => j.id === action.jobId ? { ...j, applicants: j.applicants + 1 } : j),
      };
    case 'WITHDRAW':
      return { ...state, myApplicationIds: state.myApplicationIds.filter(id => id !== action.jobId) };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(a =>
          a.id === action.id ? { ...a, status: action.status } : a
        ),
      };
    case 'ADD_JOB':
      return { ...state, jobs: [action.job, ...state.jobs] };
    case 'UPDATE_JOB_STATUS':
      return {
        ...state,
        jobs: state.jobs.map(j => j.id === action.jobId ? { ...j, status: action.status } : j),
      };
    default:
      return state;
  }
}

const JobContext = createContext<{ state: JobState; dispatch: React.Dispatch<JobAction> } | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(jobReducer, {
    jobs: MOCK_JOBS,
    applications: MOCK_APPLICATIONS,
    myApplicationIds: ['j1'],
  });
  return React.createElement(JobContext.Provider, { value: { state, dispatch } }, children);
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be used within JobProvider');
  return ctx;
}
