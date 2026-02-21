import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  DollarSign,
  Star,
  MapPin,
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  Heart,
} from 'lucide-react';
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
} from 'recharts';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { mockStats, mockEntities } from '../lib/mockData';
import TypeBadge from '../components/TypeBadge';
import ScoreBadge from '../components/ScoreBadge';

const PIE_COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#0f766e', '#115e59'];

export default function Dashboard() {
  const [stats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  const districtData = Object.entries(stats.by_district).map(([name, count]) => ({ name, count }));
  const typeData = Object.entries(stats.by_type).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: '#0d948840', borderTopColor: '#0d9488' }}
          />
          <p className="text-sm" style={{ color: '#64748b' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} fill="white" />
            <span className="text-sm font-medium opacity-90">Care Reach AI Platform</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Maternal Health Intelligence</h2>
          <p className="opacity-80 text-sm">
            AI-powered discovery for Andhra Pradesh & Telangana — {stats.total_entities} entities indexed
          </p>
          <div className="flex gap-4 mt-4">
            {[
              { label: 'AP Districts', value: '13' },
              { label: 'TG Districts', value: '33' },
              { label: 'AI Scored', value: stats.total_entities },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl font-bold">{item.value}</div>
                <div className="text-xs opacity-70">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Entities"
          value={stats.total_entities}
          icon={Building2}
          color="#0d9488"
          bg="#f0fdfa"
          change="+8 this week"
          changeType="up"
          delay={0}
        />
        <StatCard
          title="Total NGOs"
          value={stats.total_ngos}
          icon={Users}
          color="#d97706"
          bg="#fffbeb"
          change="+3 new matches"
          changeType="up"
          delay={100}
        />
        <StatCard
          title="Active Funders"
          value={stats.total_funders}
          icon={DollarSign}
          color="#059669"
          bg="#f0fdf4"
          change="$2.4M available"
          changeType="neutral"
          delay={200}
        />
        <StatCard
          title="High Priority"
          value={stats.high_priority_leads}
          icon={Star}
          color="#7c3aed"
          bg="#faf5ff"
          change="Score ≥ 85"
          changeType="neutral"
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* District Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} style={{ color: '#0d9488' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>Entities by District</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={districtData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} style={{ color: '#0d9488' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>Entity Type Distribution</h3>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {typeData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {typeData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-xs flex-1" style={{ color: '#475569' }}>{item.name}</span>
                  <span className="text-xs font-semibold" style={{ color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Find Organizations',
            desc: 'Search hospitals, PHCs & medical colleges',
            icon: Building2,
            path: '/onboarding-finder',
            color: '#0d9488',
            bg: '#f0fdfa',
          },
          {
            title: 'Discover Funders',
            desc: 'Foundations, CSR & global grants',
            icon: DollarSign,
            path: '/funding-scout',
            color: '#059669',
            bg: '#f0fdf4',
          },
          {
            title: 'Generate Outreach',
            desc: 'AI-crafted partnership emails',
            icon: Zap,
            path: '/outreach',
            color: '#7c3aed',
            bg: '#faf5ff',
          },
        ].map((item) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to={item.path}
              className="card flex items-center gap-4 p-5 group"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                style={{ background: item.bg }}
              >
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: '#0f172a' }}>{item.title}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{item.desc}</div>
              </div>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent High-Priority Entities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#0d9488' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>Top Priority Entities</h3>
          </div>
          <Link
            to="/priority-targets"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: '#0d9488', textDecoration: 'none' }}
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {mockEntities.slice(0, 5).map((entity) => (
            <div
              key={entity.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: '#f8fafc' }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ background: '#f0fdfa' }}
              >
                <Building2 size={14} style={{ color: '#0d9488' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#0f172a' }}>{entity.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <TypeBadge type={entity.type} />
                  <span className="text-xs" style={{ color: '#94a3b8' }}>{entity.district}</span>
                </div>
              </div>
              <ScoreBadge score={entity.priority_score} size="sm" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
