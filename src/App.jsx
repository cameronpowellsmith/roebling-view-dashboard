import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';

export default function RoeblingViewDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // IMPORTANT: Replace this with your actual Google Sheet ID
  const SPREADSHEET_ID = '18fc6NvHZ_7_lQv4DsesVK-eHgWBX20GK-YD56HtMMa0';
  const API_KEY = 'AIzaSyBU-_FZnSx-x8ZdUu4NZCXlZPSLjTj-T3Q';

  // Color palette from your design
  const colors = {
    darkNav: '#3A4A54',
    taupe: '#9B9278',
    beige: '#E8DCC8',
    white: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336'
  };

  // Mock data - used as fallback if Google Sheets fails
  const mockData = {
    month: 'February 2026',
    previousMonth: 'January 2026',
    totalCash: {
      operatingCash: 144270.86,
      operatingCashPrev: 142770.93,
      reserveFund: 10002.11,
      reserveFundPrev: 10000.00,
      savingsAccount: 200033.13,
      savingsAccountPrev: 200000.00,
      total: 354306.10,
      totalPrev: 352770.93
    },
    income: {
      rentalIncome: 14614.07,
      rentalIncomePrev: 14470.00,
      interestIncome: 1.59,
      interestIncomePrev: 1.50,
      total: 14615.66,
      totalPrev: 14471.50
    },
    expenses: {
      total: 12814.14,
      totalPrev: 12800.00,
      electric: 1711.23,
      electricPrev: 1650.00,
      snowRemoval: 2395.26,
      snowRemovalPrev: 2400.00,
      managementFee: 1432.22,
      managementFeePrev: 1432.00,
      garbageCleaning: 1959.75,
      garbageCleaningPrev: 1950.00,
      insurance: 2483.38,
      insurancePrev: 2483.00,
      other: 1432.30,
      otherPrev: 1884.00
    },
    netProfitLoss: 1801.52,
    netProfitLossPrev: 1671.50,
    cashFlowHistory: [
      { month: 'Oct', inflow: 14500, outflow: 13200, net: 1300 },
      { month: 'Nov', inflow: 14500, outflow: 14100, net: 400 },
      { month: 'Dec', inflow: 14500, outflow: 13800, net: 700 },
      { month: 'Jan', inflow: 14470, outflow: 12800, net: 1670 },
      { month: 'Feb', inflow: 14615.66, outflow: 12814.14, net: 1801.52 }
    ],
    reserveFundAnalysis: {
      current: 10002.11,
      previous: 10000.00,
      targetYear1: 50000,
      targetYear5: 100000,
      healthStatus: 'critical'
    }
  };

  useEffect(() => {
    const fetchFromGoogleSheets = async () => {
      setLoading(true);
      try {
        // Fetch Monthly Summary sheet
        const summaryUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/"Monthly Summary"?key=${API_KEY}`;
        const summaryRes = await fetch(summaryUrl);

        if (!summaryRes.ok) {
          throw new Error('Failed to fetch from Google Sheets. Check your Spreadsheet ID and that the sheet is shared as "Anyone with link".');
        }

        const summaryData = await summaryRes.json();
        const rows = summaryData.values || [];

        if (rows.length < 2) {
          console.warn('Not enough data in Google Sheet. Using mock data.');
          setData(mockData);
          setLoading(false);
          return;
        }

        // Get current month (row 1) and previous month (row 2)
        const current = rows[1];
        const previous = rows[2] || [];

        // Parse the data from Google Sheets
        const liveData = {
          month: current[0] || 'February 2026',
          previousMonth: previous[0] || 'January 2026',
          totalCash: {
            operatingCash: parseFloat(current[1]) || mockData.totalCash.operatingCash,
            operatingCashPrev: parseFloat(previous[1]) || mockData.totalCash.operatingCashPrev,
            reserveFund: parseFloat(current[2]) || mockData.totalCash.reserveFund,
            reserveFundPrev: parseFloat(previous[2]) || mockData.totalCash.reserveFundPrev,
            savingsAccount: parseFloat(current[3]) || mockData.totalCash.savingsAccount,
            savingsAccountPrev: parseFloat(previous[3]) || mockData.totalCash.savingsAccountPrev,
            total: parseFloat(current[4]) || mockData.totalCash.total,
            totalPrev: parseFloat(previous[4]) || mockData.totalCash.totalPrev
          },
          income: {
            rentalIncome: parseFloat(current[5]) || mockData.income.rentalIncome,
            rentalIncomePrev: parseFloat(previous[5]) || mockData.income.rentalIncomePrev,
            interestIncome: 1.59,
            interestIncomePrev: 1.50,
            total: parseFloat(current[5]) || mockData.income.total,
            totalPrev: parseFloat(previous[5]) || mockData.income.totalPrev
          },
          expenses: {
            total: parseFloat(current[6]) || mockData.expenses.total,
            totalPrev: parseFloat(previous[6]) || mockData.expenses.totalPrev,
            electric: 1711.23,
            electricPrev: 1650.00,
            snowRemoval: 2395.26,
            snowRemovalPrev: 2400.00,
            managementFee: 1432.22,
            managementFeePrev: 1432.00,
            garbageCleaning: 1959.75,
            garbageCleaningPrev: 1950.00,
            insurance: 2483.38,
            insurancePrev: 2483.00,
            other: 1432.30,
            otherPrev: 1884.00
          },
          netProfitLoss: parseFloat(current[7]) || mockData.netProfitLoss,
          netProfitLossPrev: parseFloat(previous[7]) || mockData.netProfitLossPrev,
          cashFlowHistory: mockData.cashFlowHistory,
          reserveFundAnalysis: {
            current: parseFloat(current[2]) || mockData.reserveFundAnalysis.current,
            previous: parseFloat(previous[2]) || mockData.reserveFundAnalysis.previous,
            targetYear1: 50000,
            targetYear5: 100000,
            healthStatus: 'critical'
          }
        };

        setData(liveData);
      } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        // Fall back to mock data if API fails
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchFromGoogleSheets();
  }, []);

  const TrendIndicator = ({ change, isPositiveBad = false }) => {
    if (change === null || change === undefined) return null;
    const isPositive = change > 0;
    const isBad = isPositiveBad ? isPositive : !isPositive;
    const color = isBad ? colors.danger : colors.success;
    const arrow = isPositive ? '↑' : '↓';

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        color: color,
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        <span>{arrow}</span>
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const StatCard = ({ title, value, subtext, status, icon: Icon, change, isPositiveBad }) => (
    <div className="p-3 rounded-lg" style={{ backgroundColor: colors.white, borderLeft: `4px solid ${colors.darkNav}` }}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium" style={{ color: colors.taupe }}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.darkNav }}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs mt-1" style={{ color: '#666' }}>
              {subtext}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {Icon && (
            <div style={{ color: status === 'good' ? colors.success : status === 'warning' ? colors.warning : colors.danger }}>
              <Icon size={20} />
            </div>
          )}
          {change !== null && change !== undefined && (
            <TrendIndicator change={change} isPositiveBad={isPositiveBad} />
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.beige }}>
        <div style={{ color: colors.darkNav }}>Loading dashboard...</div>
      </div>
    );
  }

  if (!data) return null;

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const getReserveStatus = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return { status: 'good', text: 'Healthy' };
    if (percentage >= 50) return { status: 'warning', text: 'Adequate' };
    return { status: 'critical', text: 'Below Target' };
  };

  const reserveStatus = getReserveStatus(data.reserveFundAnalysis.current, data.reserveFundAnalysis.targetYear1);

  return (
    <div style={{ backgroundColor: colors.beige, minHeight: '100vh' }}>
      <div style={{ backgroundColor: colors.darkNav, color: colors.white, padding: '1rem 2rem' }}>
        <h1 className="text-2xl font-bold">Roebling View North Condominiums</h1>
        <p style={{ color: colors.taupe }} className="mt-1 text-sm">Financial Dashboard • {data.month}</p>
      </div>

      <div className="max-w-7xl mx-auto p-4">

        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.darkNav }}>Cash Position</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="Operating Cash"
              value={`$${(data.totalCash.operatingCash / 1000).toFixed(0)}K`}
              subtext="For monthly operations"
              status="good"
              icon={DollarSign}
              change={calculateChange(data.totalCash.operatingCash, data.totalCash.operatingCashPrev)}
            />
            <StatCard
              title="Reserve Fund"
              value={`$${(data.totalCash.reserveFund / 1000).toFixed(1)}K`}
              subtext={`${((data.totalCash.reserveFund / data.reserveFundAnalysis.targetYear1) * 100).toFixed(1)}% of 1-year target`}
              status={reserveStatus.status}
              icon={AlertCircle}
              change={calculateChange(data.totalCash.reserveFund, data.totalCash.reserveFundPrev)}
            />
            <StatCard
              title="Savings Account"
              value={`$${(data.totalCash.savingsAccount / 1000).toFixed(0)}K`}
              subtext="Short-term reserves"
              status="good"
              icon={CheckCircle}
              change={calculateChange(data.totalCash.savingsAccount, data.totalCash.savingsAccountPrev)}
            />
            <StatCard
              title="Total Cash"
              value={`$${(data.totalCash.total / 1000).toFixed(0)}K`}
              subtext="All accounts combined"
              status="good"
              icon={CheckCircle}
              change={calculateChange(data.totalCash.total, data.totalCash.totalPrev)}
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.darkNav }}>Monthly Financials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard
              title="Total Income"
              value={`$${(data.income.total / 1000).toFixed(1)}K`}
              subtext={`Rental: $${(data.income.rentalIncome / 1000).toFixed(1)}K`}
              status="good"
              icon={TrendingUp}
              change={calculateChange(data.income.total, data.income.totalPrev)}
            />
            <StatCard
              title="Total Expenses"
              value={`$${(data.expenses.total / 1000).toFixed(1)}K`}
              subtext="Current month actual"
              status="good"
              icon={DollarSign}
              change={calculateChange(data.expenses.total, data.expenses.totalPrev)}
              isPositiveBad={true}
            />
            <StatCard
              title="Net Profit"
              value={`$${(data.netProfitLoss / 1000).toFixed(1)}K`}
              subtext={data.netProfitLoss > 0 ? 'Surplus this month' : 'Deficit this month'}
              status={data.netProfitLoss > 0 ? 'good' : 'warning'}
              icon={data.netProfitLoss > 0 ? TrendingUp : TrendingDown}
              change={calculateChange(data.netProfitLoss, data.netProfitLossPrev)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.white }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: colors.darkNav }}>
              Cash Flow Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={data.cashFlowHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inflow" fill={colors.success} name="Monthly Income" opacity={0.8} />
                <Bar dataKey="outflow" fill={colors.warning} name="Monthly Expenses" opacity={0.8} />
                <Line type="monotone" dataKey="net" stroke={colors.darkNav} name="Net Cash Flow" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.white }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: colors.darkNav }}>
              Monthly Expenses by Category
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { category: 'Insurance', amount: data.expenses.insurance },
                { category: 'Snow Removal', amount: data.expenses.snowRemoval },
                { category: 'Garbage/Clean', amount: data.expenses.garbageCleaning },
                { category: 'Management Fee', amount: data.expenses.managementFee },
                { category: 'Electric', amount: data.expenses.electric },
                { category: 'Other', amount: data.expenses.other }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill={colors.taupe} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.white }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: colors.darkNav }}>
            Reserve Fund Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="text-center p-2" style={{ backgroundColor: colors.beige, borderRadius: '6px' }}>
              <p className="text-xs font-medium" style={{ color: colors.taupe }}>Current Balance</p>
              <p className="text-xl font-bold mt-1" style={{ color: colors.darkNav }}>
                ${(data.reserveFundAnalysis.current / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="text-center p-2" style={{ backgroundColor: colors.beige, borderRadius: '6px' }}>
              <p className="text-xs font-medium" style={{ color: colors.taupe }}>1-Year Target</p>
              <p className="text-xl font-bold mt-1" style={{ color: colors.darkNav }}>
                ${(data.reserveFundAnalysis.targetYear1 / 1000).toFixed(0)}K
              </p>
              <p className="text-xs mt-1" style={{ color: colors.taupe }}>
                {((data.reserveFundAnalysis.current / data.reserveFundAnalysis.targetYear1) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-2" style={{ backgroundColor: colors.beige, borderRadius: '6px' }}>
              <p className="text-xs font-medium" style={{ color: colors.taupe }}>5-Year Target</p>
              <p className="text-xl font-bold mt-1" style={{ color: colors.darkNav }}>
                ${(data.reserveFundAnalysis.targetYear5 / 1000).toFixed(0)}K
              </p>
              <p className="text-xs mt-1" style={{ color: colors.taupe }}>
                {((data.reserveFundAnalysis.current / data.reserveFundAnalysis.targetYear5) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-2" style={{ backgroundColor: colors.beige, borderRadius: '6px' }}>
              <p className="text-xs font-medium" style={{ color: colors.taupe }}>Health</p>
              <p className="text-xl font-bold mt-1" style={{
                color: reserveStatus.status === 'good' ? colors.success : reserveStatus.status === 'warning' ? colors.warning : colors.danger
              }}>
                {reserveStatus.text}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.taupe }}>
                {reserveStatus.status === 'critical' ? '⚠️' : '✓'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.white }}>
          <h2 className="text-sm font-bold mb-2" style={{ color: colors.darkNav }}>
            Key Metrics Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div style={{ borderLeft: `3px solid ${colors.success}`, paddingLeft: '0.75rem' }}>
              <p className="font-semibold text-xs" style={{ color: colors.darkNav }}>Monthly Performance</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Generated ${(data.netProfitLoss).toFixed(2)} surplus</p>
            </div>
            <div style={{ borderLeft: `3px solid ${colors.warning}`, paddingLeft: '0.75rem' }}>
              <p className="font-semibold text-xs" style={{ color: colors.darkNav }}>Reserve Fund</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>At {((data.reserveFundAnalysis.current / data.reserveFundAnalysis.targetYear1) * 100).toFixed(0)}% of target</p>
            </div>
            <div style={{ borderLeft: `3px solid ${colors.darkNav}`, paddingLeft: '0.75rem' }}>
              <p className="font-semibold text-xs" style={{ color: colors.darkNav }}>Largest Expense</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Insurance: ${data.expenses.insurance.toFixed(2)}</p>
            </div>
            <div style={{ borderLeft: `3px solid ${colors.taupe}`, paddingLeft: '0.75rem' }}>
              <p className="font-semibold text-xs" style={{ color: colors.darkNav }}>Liquid Assets</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>${(data.totalCash.total / 1000).toFixed(0)}K total cash</p>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs" style={{ color: colors.taupe }}>
          <p>Data from: {data.month} • Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
