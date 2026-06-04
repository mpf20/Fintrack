'use client';

import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import { useApp } from '@/contexts/AppContext';
import {
  formatCurrency,
  getTotalIncome,
  getTotalExpenses,
  getTotalSavings,
  getNetBalance,
  getMonthlyChartData,
  getCategoryBreakdown,
} from '@/lib/calculations';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank, TrendingUp, Settings } from 'lucide-react';
import { useState } from 'react';
import { MONTHS } from '@/types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm" style={{ minWidth: 140 }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
          <span style={{ color: p.color, fontWeight: 600 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { transactions, initialBalance, setInitialBalance } = useApp();
  const [editBalance, setEditBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(initialBalance.toString());

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const totalSavings = getTotalSavings(transactions);
  const currentBalance = getNetBalance(transactions, initialBalance);
  const chartData = getMonthlyChartData(transactions);
  const topExpenses = getCategoryBreakdown(transactions, 'expense').slice(0, 5);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTransactions = transactions.filter((t) => t.monthKey === currentMonthKey);
  const monthIncome = getTotalIncome(currentMonthTransactions);
  const monthExpenses = getTotalExpenses(currentMonthTransactions);

  const saveBalance = () => {
    const val = parseFloat(balanceInput);
    if (!isNaN(val)) setInitialBalance(val);
    setEditBalance(false);
  };

  return (
    <AppShell>
      <div className="p-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Financial overview — 2026</p>
          </div>
          <button
            onClick={() => { setEditBalance(true); setBalanceInput(initialBalance.toString()); }}
            className="btn-ghost flex items-center gap-2 text-xs"
          >
            <Settings size={13} />
            Set Starting Balance
          </button>
        </div>

        {editBalance && (
          <div className="card p-5 mb-6 flex items-center gap-4 animate-fade-in" style={{ borderColor: 'var(--rose)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Starting balance:</p>
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
              <input type="number" className="input-field" style={{ paddingLeft: '24px' }}
                value={balanceInput} onChange={(e) => setBalanceInput(e.target.value)} />
            </div>
            <button className="btn-primary text-sm" onClick={saveBalance}>Save</button>
            <button className="btn-ghost text-sm" onClick={() => setEditBalance(false)}>Cancel</button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Available Balance"
            value={formatCurrency(currentBalance)}
            sub="All-time net"
            accent="var(--mauve-dark)"
            accentBg="var(--blush-mid)"
            icon={<DollarSign size={15} />}
          />
          <StatCard
            label="Total Income"
            value={formatCurrency(totalIncome)}
            sub="Year to date"
            accent="var(--income)"
            accentBg="var(--income-bg)"
            icon={<ArrowUpRight size={15} />}
          />
          <StatCard
            label="Total Expenses"
            value={formatCurrency(totalExpenses)}
            sub="Year to date"
            accent="var(--expense)"
            accentBg="var(--expense-bg)"
            icon={<ArrowDownRight size={15} />}
          />
          <StatCard
            label="Net Savings"
            value={formatCurrency(totalSavings)}
            sub="Income minus expenses"
            accent="var(--savings)"
            accentBg="var(--savings-bg)"
            icon={<PiggyBank size={15} />}
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Area chart */}
          <div className="card p-6 col-span-2">
            <h2 className="font-display text-xl mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7aab8a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7aab8a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c47a7a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c47a7a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#7aab8a" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#c47a7a" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top expenses */}
          <div className="card p-6">
            <h2 className="font-display text-xl mb-4" style={{ color: 'var(--text-primary)' }}>Top Expenses</h2>
            {topExpenses.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No expenses yet.</p>
            ) : (
              <div className="space-y-3">
                {topExpenses.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-secondary)' }}>{item.category}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--border-light)' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${item.percentage}%`, background: 'var(--rose-deep)', transition: 'width 0.5s ease' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly bar chart */}
        <div className="card p-6">
          <h2 className="font-display text-xl mb-4" style={{ color: 'var(--text-primary)' }}>Net by Month</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="net" name="Net" fill="var(--rose)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
