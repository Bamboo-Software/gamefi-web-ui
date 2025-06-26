import { ILast7DaysStake } from '@/interfaces/stake';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Loader2, AlertTriangle } from 'lucide-react';

export const StakingBarChart = ({
  data,
  isLoading,
  isFailed,
}: {
  data?: ILast7DaysStake[];
  isLoading: boolean;
  isFailed: boolean;
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 h-[360px] flex flex-col">
      <h3 className="text-white font-semibold text-lg mb-4">
        Stake History (Last 7 Days)
      </h3>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      ) : isFailed ? (
        <div className="flex-1 flex flex-col items-center justify-center text-red-400">
          <AlertTriangle className="w-6 h-6 mb-2" />
          <p>Failed to load stake data.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.2} />
            <XAxis
              dataKey="date"
              stroke="#D1D5DB"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis
              stroke="#D1D5DB"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              cursor={{ fill: '#ffffff11' }}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: 8,
                color: 'white',
                fontSize: 14,
              }}
              formatter={(value: number) => [
                value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                }),
                'Stake amount',
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="averageStake" fill="#a78bfa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
