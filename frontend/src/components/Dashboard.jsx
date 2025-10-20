import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCompliant, setTotalCompliant] = useState(0);
  const [mostDisciplined, setMostDisciplined] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/detect/ppe_stats");
        const data = res.data;

        setStats(data.ppe_stats || data);
        setTotalEmployees(data.total_employees || 0);
        setTotalCompliant(data.total_compliant || 0);
        setMostDisciplined(data.most_disciplined || null);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = Object.entries(stats).map(([item, count]) => ({
    item,
    count,
  }));

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">PPE Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Total Compliant</h3>
          <p className="text-2xl font-bold">{totalCompliant}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Compliance Rate</h3>
          <p className="text-2xl font-bold">
            {totalEmployees
              ? ((totalCompliant / totalEmployees) * 100).toFixed(1) + "%"
              : "0%"}
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Most Disciplined Employee</h3>
          {mostDisciplined ? (
            <>
              <p className="text-md font-medium">{mostDisciplined.employee_email}</p>
              <p className="text-2xl font-bold">{mostDisciplined.compliance_rate}%</p>
            </>
          ) : (
            <p className="text-md font-medium">No data</p>
          )}
        </div>
      </div>

      {/* PPE Missed Items Chart */}
      <div className="p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Most Missed PPE Items</h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
