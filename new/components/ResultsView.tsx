import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from 'react';
import { StudentResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Award, Book, Share2, Download, ArrowLeft, PartyPopper } from 'lucide-react';

interface ResultsViewProps {
  result: StudentResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  
  const chartData = result.subjects.map(sub => ({
    name: sub.code.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6),
    points: sub.gradePoints || 0,
    credits: sub.credits,
    fullTitle: sub.name
  }));

  const getBarColor = (points: number) => {
    if (points >= 9) return '#4ade80'; // Green
    if (points >= 7) return '#60a5fa'; // Blue
    if (points >= 5) return '#fbbf24'; // Yellow
    return '#f87171'; // Red
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onReset}
        className="flex items-center text-gray-600 font-bold hover:text-indigo-600 transition-colors mb-2 bg-white/50 px-4 py-2 rounded-full w-fit backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Calculator
      </button>

      {/* Gradient Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SGPA Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-300 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-indigo-100 font-bold tracking-wider text-sm uppercase">SGPA Score</span>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
             <div className="text-6xl font-extrabold tracking-tight">{result.sgpa}</div>
             <div className="text-indigo-200 text-xl font-medium">/ 10</div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-indigo-200 text-sm font-medium">
            <PartyPopper className="h-4 w-4" /> Semester {result.semester || 'N/A'} Result
          </div>
        </div>

        {/* Credits Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl shadow-teal-300 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-teal-100 font-bold tracking-wider text-sm uppercase">Total Credits</span>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Book className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-5xl font-extrabold tracking-tight">{result.totalCredits}</div>
          <div className="mt-4 text-teal-100 text-sm font-medium">Successfully Registered</div>
        </div>

        {/* Student Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-pink-500 to-orange-500"></div>
           <div>
             <h4 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Student Profile</h4>
             <p className="font-bold text-gray-900 text-xl truncate">{result.name || "Guest Student"}</p>
             <p className="text-gray-500 font-mono text-sm mt-1 bg-gray-100 px-2 py-1 rounded-md inline-block">{result.usn || "USN: N/A"}</p>
           </div>
           <div className="flex gap-3 mt-6">
 <button
  onClick={() => {
    if (navigator.share) {
      navigator.share({
        title: "Your App",
        text: "Check this!",
        url: window.location.href
      });
    } else {
      alert("Sharing not supported on this browser");
    }
  }}
  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-indigo-100"
>
  <Share2 className="h-4 w-4" /> Share
</button>
   
<button
  onClick={async () => {
    const element = document.body;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("download.pdf");
  }}
  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-gray-200"
>
  <Download className="h-4 w-4" /> PDF
</button>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel p-8 rounded-3xl shadow-lg border-t-4 border-indigo-500">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Performance Analysis</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} 
                dy={10}
              />
              <Tooltip 
                cursor={{fill: 'rgba(99, 102, 241, 0.1)', radius: 8}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900/90 backdrop-blur-xl text-white text-xs p-4 rounded-xl shadow-xl border border-gray-700">
                        <p className="font-bold text-base mb-2 text-white">{data.fullTitle}</p>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <p>Points: <span className="font-bold text-green-400 text-lg">{data.points}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <p>Credits: <span className="text-gray-300">{data.credits}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Bar dataKey="points" radius={[8, 8, 8, 8]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.points)} className="hover:opacity-80 transition-opacity cursor-pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="glass-panel rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200/60 bg-gray-50/50">
           <h3 className="text-lg font-bold text-gray-900">Detailed Grade Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Name</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade Points</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-indigo-600 font-mono">{sub.code}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-800">{sub.name}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 text-center font-medium">{sub.credits}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-900 font-bold text-sm">
                      {(sub.gradePoints || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    {(sub.gradePoints || 0) >= 4 ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-700 border border-green-200 shadow-sm">
                        Pass
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-700 border border-red-200 shadow-sm">
                        Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;