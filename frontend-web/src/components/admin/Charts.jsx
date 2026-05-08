import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 300 },
  { name: 'Apr', sales: 4500, orders: 280 },
  { name: 'May', sales: 6000, orders: 390 },
  { name: 'Jun', sales: 5500, orders: 350 },
]

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Sports', value: 15 },
  { name: 'Books', value: 5 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function SalesChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Sales ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OrdersChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4">Orders by Month</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#10b981" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default { SalesChart, OrdersChart, CategoryChart }
