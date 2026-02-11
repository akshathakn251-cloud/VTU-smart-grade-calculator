export enum CalculationType {
  MANUAL = 'MANUAL',
  PDF = 'PDF',
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  marks?: number; // For manual entry
  gradePoints?: number; // Calculated or parsed
  gradeLetter?: string; // S, A, B etc.
}

export interface StudentResult {
  usn?: string;
  name?: string;
  semester?: number;
  scheme?: string;
  sgpa: number;
  totalCredits: number;
  subjects: Subject[];
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface VtuScheme {
  year: string;
  label: string;
}

export const VTU_SCHEMES: VtuScheme[] = [
  { year: '2022', label: '2022 Scheme' },
  { year: '2021', label: '2021 Scheme' },
  { year: '2018', label: '2018 Scheme' },
  { year: '2017', label: '2017 Scheme' },
  { year: '2015', label: '2015 Scheme' },
];

export const BRANCHES = [
  'Computer Science (CSE)',
  'Information Science (ISE)',
  'Electronics & Comm (ECE)',
  'Mechanical (ME)',
  'Civil (CV)',
  'Artificial Intelligence (AIML)',
];

export interface SyllabusRequest {
  scheme: string;
  branch: string;
  semester: number;
}