import React, { useState } from 'react';
import { Search, BookOpen, Calculator, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { BRANCHES, VTU_SCHEMES, Subject, StudentResult } from '../types';
import { fetchSyllabusFromAI } from '../services/geminiService';
import { calculateSGPA, calculateGradePoint } from '../utils/grading';

interface ManualEntryProps {
  onCalculate: (result: StudentResult) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onCalculate }) => {
  const [scheme, setScheme] = useState(VTU_SCHEMES[0].year);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [semester, setSemester] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const handleFetchSubjects = async () => {
    setIsFetching(true);
    try {
      const data = await fetchSyllabusFromAI({ scheme, branch, semester });
      const subjectsWithMarks = data.map(s => ({ ...s, marks: 0 }));
      setSubjects(subjectsWithMarks);
    } catch (error: any) {
      console.error(error);
      // Display the specific error (e.g., "API Key not found") to help the user debug
      alert(error.message || "Failed to fetch syllabus. Please check your API Key configuration.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleMarkChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    const numVal = parseInt(value) || 0;
    const clamped = Math.min(100, Math.max(0, numVal));
    
    newSubjects[index].marks = clamped;
    newSubjects[index].gradePoints = calculateGradePoint(clamped);
    setSubjects(newSubjects);
  };

  const handleCreditChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].credits = parseFloat(value) || 0;
    setSubjects(newSubjects);
  };

  const addNewSubject = () => {
    setSubjects([...subjects, { code: 'NEW', name: 'New Subject', credits: 3, marks: 0, gradePoints: 0 }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    const sgpa = calculateSGPA(subjects);
    const totalCredits = subjects.reduce((sum, sub) => sum + sub.credits, 0);
    
    onCalculate({
      scheme,
      semester,
      sgpa,
      totalCredits,
      subjects
    });
  };

  return (
    <div className="space-y-8">
      {/* Configuration Panel */}
      <div className="glass-panel p-8 rounded-3xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
             <BookOpen className="h-6 w-6" />
          </div>
          Step 1: Select Semester Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Scheme</label>
            <select 
              value={scheme} 
              onChange={(e) => setScheme(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              {VTU_SCHEMES.map(s => (
                <option key={s.year} value={s.year}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Branch</label>
            <select 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Semester</label>
            <select 
              value={semester} 
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>Semester {n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleFetchSubjects}
            disabled={isFetching}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 transform hover:-translate-y-0.5"
          >
            {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-yellow-400" />}
            {isFetching ? 'AI Fetching...' : 'Auto-Fetch Subjects'}
          </button>
        </div>
      </div>

      {/* Subject List */}
      {subjects.length > 0 && (
        <div className="glass-panel p-8 rounded-3xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                <Calculator className="h-6 w-6" />
              </div>
              Step 2: Enter Marks
            </h3>
            <button 
              onClick={addNewSubject}
              className="text-sm text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-indigo-200"
            >
              <Plus className="h-4 w-4" /> Add Subject
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Subject</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((sub, idx) => (
                  <tr key={idx} className="group hover:bg-white/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-mono font-semibold text-gray-600">{sub.code}</td>
                    <td className="py-4 px-4">
                      <input 
                        type="text" 
                        value={sub.name}
                        onChange={(e) => {
                           const newSubjects = [...subjects];
                           newSubjects[idx].name = e.target.value;
                           setSubjects(newSubjects);
                        }}
                        className="w-full bg-transparent focus:outline-none font-semibold text-gray-800 placeholder-gray-400"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                       <input 
                        type="number" 
                        value={sub.credits}
                        onChange={(e) => handleCreditChange(idx, e.target.value)}
                        className="w-16 text-center p-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input 
                        type="number" 
                        value={sub.marks || ''}
                        placeholder="-"
                        onChange={(e) => handleMarkChange(idx, e.target.value)}
                        className="w-20 text-center p-2 rounded-lg border border-gray-300 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-indigo-900"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shadow-sm
                        ${(sub.gradePoints || 0) >= 9 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 
                          (sub.gradePoints || 0) >= 7 ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' :
                          (sub.gradePoints || 0) >= 4 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 
                          'bg-gradient-to-br from-red-400 to-red-600 text-white'
                        }`}>
                        {sub.gradePoints}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => removeSubject(idx)}
                        className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleCalculate}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-300 transform hover:-translate-y-1 transition-all"
            >
              Calculate Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualEntry;