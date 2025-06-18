
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Point } from '../types';

interface LineGraphProps {
  data: Point[];
  lineColor?: string;
  title?: string;
  isMiniMode?: boolean; 
}

const LineGraph: React.FC<LineGraphProps> = ({ data, lineColor = "#0ea5e9", title, isMiniMode = false }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-400">{isMiniMode ? "No data" : "No data available for graph."}</div>;
  }
  
  return (
    <div className="h-full w-full"> {/* Height is controlled by parent */}
      {title && !isMiniMode && <h4 className="text-lg font-semibold text-slate-200 mb-2 text-center">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={isMiniMode ? 
            { top: 5, right: 5, left: 5, bottom: 5 } : 
            { top: 5, right: 20, left: 0, bottom: 5 }
          }
        >
          {!isMiniMode && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />} {/* slate-700 */}
          {!isMiniMode && <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} height={15}/>} {/* slate-400 */}
          {!isMiniMode && <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} domain={['auto', 'auto']}/>}
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', // slate-800
              border: '1px solid #334155', // slate-700
              borderRadius: '0.375rem',
              padding: isMiniMode ? '4px 8px' : undefined 
            }}
            labelStyle={{ color: '#e2e8f0', display: isMiniMode ? 'none': undefined }} // slate-200
            itemStyle={{ color: lineColor, fontSize: isMiniMode ? '12px' : undefined }}
            formatter={isMiniMode ? (value: number) => [value, null] : undefined} // Show only value in mini mode
          />

          {!isMiniMode && <Legend wrapperStyle={{ color: '#e2e8f0' }} />} {/* slate-200 */}
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={lineColor} 
            strokeWidth={2} 
            activeDot={{ r: isMiniMode ? 3 : 5 }} 
            dot={false} 
            name={isMiniMode ? undefined : "Interest"} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
