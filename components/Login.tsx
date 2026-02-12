import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { UserRole } from '../types';
import { Building2, School, User, KeyRound, Lock, Badge, Store } from 'lucide-react';
import { CENTRAL_STORE_CREDENTIALS, HEAD_OFFICE_CREDENTIALS } from '../constants';

export const Login: React.FC = () => {
  const { login, schools, employees, userCredentials } = useAppStore();
  const [activeTab, setActiveTab] = useState<'HO' | 'BRANCH' | 'STORE'>('HO');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [branchRole, setBranchRole] = useState<UserRole.ACCOUNTANT | UserRole.USER>(UserRole.ACCOUNTANT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auto-fill credentials for convenience
  useEffect(() => {
    // Reset fields on tab switch
    setPassword('');
    setUsername('');

    if (activeTab === 'HO') {
      setUsername(HEAD_OFFICE_CREDENTIALS.username);
      setPassword(HEAD_OFFICE_CREDENTIALS.password);
    } else if (activeTab === 'STORE') {
      setUsername(CENTRAL_STORE_CREDENTIALS.username);
      setPassword(CENTRAL_STORE_CREDENTIALS.password);
    } else {
      // Logic for Branch Tab
      if (selectedSchool) {
        if (branchRole === UserRole.ACCOUNTANT) {
           const cred = userCredentials.find(c => c.schoolId === selectedSchool && c.role === UserRole.ACCOUNTANT);
           if (cred) {
               setPassword(cred.password);
           }
        } else {
           // For User Role - Auto pick the first employee of this school
           const emp = employees.find(e => e.schoolId === selectedSchool);
           if (emp) {
             setUsername(emp.id); // Set Employee ID
             setPassword(`${emp.id}@123`);
           }
        }
      }
    }
  }, [activeTab, selectedSchool, branchRole, schools, employees, userCredentials]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    
    if (activeTab === 'HO') {
      if (username !== HEAD_OFFICE_CREDENTIALS.username) {
        setError("Invalid Head Office Username");
        return;
      }
      success = login(null, UserRole.HEAD_OFFICE, password);
    } else if (activeTab === 'STORE') {
      if (username !== CENTRAL_STORE_CREDENTIALS.username) {
        setError("Invalid Central Store Username");
        return;
      }
      success = login(null, UserRole.CENTRAL_STORE_MANAGER, password);
    } else {
      if (!selectedSchool) {
        setError("Please select a school branch");
        return;
      }
      // For Accountant, username is ignored/not used. For User, username is EmployeeID.
      success = login(selectedSchool, branchRole, password, username);
    }

    if (!success) {
      setError("Invalid credentials. Please check details.");
    }
  };

  const inputClasses = "pl-10 w-full rounded-lg border border-brand-700 bg-brand-900 px-4 py-2.5 text-white placeholder-brand-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-400 outline-none transition-all";
  const selectClasses = "pl-10 w-full rounded-lg border border-brand-700 bg-brand-900 px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-400 outline-none appearance-none";
  const iconClasses = "absolute left-3 top-3 text-brand-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden">
        
        {/* Left Side - Visual */}
        <div className="hidden md:flex w-1/2 bg-brand-600 flex-col items-center justify-center p-12 text-white relative">
          <div className="absolute inset-0 bg-brand-700 opacity-20 pattern-dots"></div>
          <Building2 size={80} className="mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-2 text-center">Darshan Inventory</h1>
          <p className="text-brand-100 text-center text-lg">Centralized Stock Management System for Educational Excellence.</p>
          <div className="mt-12 text-sm text-brand-200">
            Secure Access • Real-time Tracking
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Please login to your account</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('HO'); setError(''); }}
              className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'HO' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Head Office
            </button>
            <button
              onClick={() => { setActiveTab('BRANCH'); setError(''); }}
              className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'BRANCH' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              School Branch
            </button>
             <button
              onClick={() => { setActiveTab('STORE'); setError(''); }}
              className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'STORE' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Central Store
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {activeTab === 'HO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <User className={iconClasses} size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClasses}
                    placeholder="Enter HO ID"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'STORE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <Store className={iconClasses} size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClasses}
                    placeholder="Enter Store ID"
                  />
                </div>
              </div>
            )}

            {activeTab === 'BRANCH' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch</label>
                  <div className="relative">
                    <School className={iconClasses} size={18} />
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className={selectClasses}
                    >
                      <option value="" className="bg-brand-900 text-white">-- Select School --</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id} className="bg-brand-900 text-white">{school.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                   <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          checked={branchRole === UserRole.ACCOUNTANT}
                          onChange={() => setBranchRole(UserRole.ACCOUNTANT)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700">Accountant</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          checked={branchRole === UserRole.USER}
                          onChange={() => setBranchRole(UserRole.USER)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700">User</span>
                     </label>
                   </div>
                </div>

                {/* Conditional Input for User Role */}
                {branchRole === UserRole.USER && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <div className="relative">
                      <Badge className={iconClasses} size={18} />
                      <input
                        type="text"
                        value={username} // Reusing username state for Employee ID
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputClasses}
                        placeholder="Enter Employee ID (e.g. 101)"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className={iconClasses} size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                 {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <KeyRound size={18} />
              Login to System
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Darshan Educational Network
          </div>
        </div>
      </div>
    </div>
  );
};
