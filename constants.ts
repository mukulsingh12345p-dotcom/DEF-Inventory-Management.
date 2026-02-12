
import { School, Employee } from './types';

export const SCHOOL_BRANCHES: string[] = [
  "Ambala",
  "Amritsar",
  "Bhubaneswar",
  "Cali, Colombia",
  "Dasuya",
  "Delhi",
  "Devlali",
  "Ferozepur",
  "Hisar",
  "Jagdishpura",
  "Jalandhar",
  "Kaithal",
  "Kalka",
  "Lucknow",
  "Ludhiana",
  "Meerut",
  "Modasa",
  "Pune",
  "Rathonda",
  "Sundargarh",
  "Gularia Bhat",
  "Bigas",
  "Jansath"
];

export const SCHOOLS: School[] = SCHOOL_BRANCHES.map(name => ({
  id: name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
  name: name
}));

const DUMMY_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Shaurya", "Atharv", "Neerav", "Rohan", "Mohan", "Sohan", "Rahul", "Vikram", "Anjali", "Priya"
];

export const MOCK_EMPLOYEES: Employee[] = [];

SCHOOLS.forEach((school, index) => {
  const startId = (index * 10) + 1;
  for (let i = 0; i < 10; i++) {
    const id = (startId + i).toString();
    const name = DUMMY_NAMES[(startId + i) % DUMMY_NAMES.length];
    MOCK_EMPLOYEES.push({
      id: id,
      name: name,
      schoolId: school.id
    });
  }
});

export const DEFAULT_CATEGORIES = [
  "Arts and Craft",
  "IT Equipment",
  "Science Lab",
  "Sports",
  "Stationery",
  "Furniture",
  "Library"
];

// Head Office Store Specifics
export const HO_STORE_ID = 'HO_CENTRAL_STORE';
export const HO_STORE_CATEGORIES = ['Books', 'Stationery'];

export const HEAD_OFFICE_CREDENTIALS = {
  username: "DEF",
  password: "DEF@123"
};

export const CENTRAL_STORE_CREDENTIALS = {
  username: "STORE",
  password: "STORE@123"
};

export const FINANCIAL_YEARS = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
  "2030-2031"
];

export const getCurrentFinancialYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11. April is 3.
  if (month >= 3) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};
