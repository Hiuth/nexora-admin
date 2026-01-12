"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/api-utils";

// Color palette for charts
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

interface CategoryRevenueData {
  categoryId: string;
  categoryName: string;
  totalRevenue: number;
  percentage?: number;
}

interface RevenueBarChartProps {
  data: CategoryRevenueData[];
  title?: string;
}

export function RevenueBarChart({ data, title = "Doanh thu theo danh mục" }: RevenueBarChartProps) {
  // Sort data by revenue descending
  const sortedData = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          {data.length} danh mục
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="categoryName" 
              tick={{ fontSize: 10 }}
              stroke="#64748b"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              stroke="#64748b"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
              labelStyle={{ color: "#1f2937" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "14px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
            <Bar 
              dataKey="totalRevenue" 
              fill="url(#colorRevenue)"
              radius={[6, 6, 0, 0]}
              stroke="#3B82F6"
              strokeWidth={0}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface CategoryPieChartProps {
  data: CategoryRevenueData[];
  title?: string;
}

export function CategoryPieChart({ data, title = "Phân bổ doanh thu" }: CategoryPieChartProps) {
  // Sort and take top 8 categories for better visualization
  const sortedData = [...data]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 8);
    
  const pieData = sortedData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  const customLabel = ({ categoryName, percentage }: any) => {
    if (percentage > 3) { // Only show label if > 3%
      return `${percentage?.toFixed(1)}%`;
    }
    return '';
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-2 gap-2 mt-4 max-h-24 overflow-y-auto">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs font-medium text-gray-700 truncate">
              {entry.payload.categoryName}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              ({entry.payload.percentage?.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          Top {pieData.length}
        </div>
      </div>
      <div className="h-96"> {/* Increased height */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="totalRevenue"
              label={customLabel}
              fontSize={11}
              stroke="#fff"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "14px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
            <Legend 
              content={renderCustomLegend}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface OrderTrendData {
  period: string;
  orders: number;
  revenue: number;
}

interface OrderTrendChartProps {
  data: OrderTrendData[];
  title?: string;
}

export function OrderTrendChart({ data, title = "Xu hướng đơn hàng" }: OrderTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "orders" ? value : formatCurrency(value),
                name === "orders" ? "Đơn hàng" : "Doanh thu"
              ]}
              labelStyle={{ color: "#1f2937" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stackId="1"
              stroke="#10B981"
              fill="url(#colorOrders)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Mini chart for dashboard overview
interface MiniChartProps {
  data: { name: string; value: number }[];
  type: "bar" | "line";
  color?: string;
  height?: number;
}

export function MiniChart({ data, type, color = "#3B82F6", height = 60 }: MiniChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data}>
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}