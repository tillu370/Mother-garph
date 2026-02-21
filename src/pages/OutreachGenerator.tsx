import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Send,
  RefreshCw,
  Edit3,
  Building2,
} from 'lucide-react';
import { mockEntities, mockNGOs, mockFunders } from '../lib/mockData';
import { apiService } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TypeBadge from '../components/TypeBadge';

const emailTemplates: Record<string, { subject: string; body: string }> = {
  'Private Hospital': {
    subject: 'Partnership Opportunity: Maternal Health Outreach Program – MotherSource AI',
    body: `Dear [Hospital Name] Team,

I hope this message finds you well. I am writing on behalf of MotherSource AI, a maternal health intelligence platform focused on improving maternal outcomes across Andhra Pradesh and Telangana.

We have identified [Hospital Name] as a leading healthcare institution with exceptional maternal care capabilities in [District]. Your commitment to women's health aligns perfectly with our mission to reduce maternal mortality in the region.

We would love to explore a partnership that includes:
• Integration with our maternal health tracking platform
• Participation in our community outreach network
• Access to our AI-powered patient referral system
• Joint training programs for maternal health staff

Our platform currently works with 47+ healthcare entities across AP and Telangana, and we believe [Hospital Name] would be an invaluable partner in our mission.

Would you be available for a 30-minute call this week to discuss this opportunity further?

Warm regards,
MotherSource AI Team
maternal@mothersource.ai | www.mothersource.ai`,
  },
  NGO: {
    subject: 'Collaboration Opportunity: Maternal Health Program Partnership – MotherSource AI',
    body: `Dear [Organization Name] Team,

Greetings from MotherSource AI!

We are reaching out to explore a meaningful collaboration with [Organization Name] on maternal health initiatives across Andhra Pradesh and Telangana.

Your organization's work in maternal health and community outreach closely aligns with our AI-powered platform that helps identify, connect, and scale maternal health programs across the region.

We propose the following areas of collaboration:
• Co-designing community outreach programs
• Sharing data insights for program improvement
• Joint funding applications for maternal health grants
• Capacity building through our AI-powered tools

We have successfully matched NGOs with maternal health programs resulting in 40% improved reach and outcomes. We believe [Organization Name]'s grassroots expertise combined with our technology can create significant impact.

Let's schedule a call to discuss how we can work together.

With warm regards,
MotherSource AI Partnership Team
partners@mothersource.ai`,
  },
  Funder: {
    subject: 'Grant Proposal: AI-Powered Maternal Health Outreach – AP & Telangana',
    body: `Dear [Funder Name] Team,

I am writing to present an exciting funding opportunity in maternal health innovation for Andhra Pradesh and Telangana.

MotherSource AI is an AI-powered maternal health intelligence platform that helps organizations discover outreach channels, identify NGO partners, and connect with funding opportunities — specifically focused on reducing maternal mortality in AP and Telangana.

Project Overview:
• Scope: 13 districts in AP + 33 districts in Telangana
• Impact: Connecting 50+ healthcare entities with maternal health programs
• Technology: AI classification, embeddings-based matching, priority scoring
• Timeline: 18-month pilot with measurable outcomes

Expected Outcomes:
✓ 30% improvement in maternal health program reach
✓ 500+ healthcare providers onboarded
✓ 25+ NGO-program partnerships facilitated
✓ Real-time maternal health data for policy makers

We believe this aligns perfectly with [Funder Name]'s focus on maternal health and innovation in South India.

We would welcome the opportunity to present a full proposal. Could we schedule a discovery call?

Thank you for your consideration.

Sincerely,
MotherSource AI Team
grants@mothersource.ai | www.mothersource.ai`,
  },
  'Government Hospital': {
    subject: 'Digital Health Partnership: Maternal Health Intelligence Platform – MotherSource AI',
    body: `Dear Director/Medical Superintendent,

I am writing to introduce MotherSource AI, a maternal health intelligence platform designed to support government health institutions in Andhra Pradesh and Telangana.

[Hospital Name] has been identified as a critical node in the maternal health ecosystem of [District]. We would like to offer our platform to support your maternal health programs at no cost during our pilot phase.

Our platform offers:
• Real-time maternal health data analytics
• Integration with NHM and JSSK schemes
• Community health worker coordination tools
• Referral network management
• Maternal mortality audit support

We are committed to supporting the government's goal of reducing maternal mortality ratio (MMR) in AP and Telangana, and we believe a partnership with [Hospital Name] would be a significant step toward this goal.

We would be honored to present our platform to your team at your convenience.

Respectfully,
MotherSource AI Team
govt@mothersource.ai`,
  },
};

const allOrgs = [
  ...mockEntities.map((e) => ({ name: e.name, type: e.type })),
  ...mockNGOs.map((n) => ({ name: n.name, type: 'NGO' })),
  ...mockFunders.map((f) => ({ name: f.name, type: f.type })),
];

export default function OutreachGenerator() {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState('');

  // Check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const org = params.get('org');
    const type = params.get('type');
    if (org) setSelectedOrg(org);
    if (type) setSelectedType(type);
  }, []);

  const handleGenerate = async () => {
    if (!selectedOrg) return;
    setGenerating(true);
    setEmail(null);
    setEditing(false);
    try {
      const res = await apiService.generateEmail(selectedOrg, selectedType);
      setEmail(res.data);
      setEditedBody(res.data.body);
    } catch {
      // Use template
      const template = emailTemplates[selectedType] ||
        emailTemplates['Private Hospital'];
      const customized = {
        subject: template.subject.replace('[Hospital Name]', selectedOrg).replace('[Organization Name]', selectedOrg).replace('[Funder Name]', selectedOrg),
        body: template.body
          .replace(/\[Hospital Name\]/g, selectedOrg)
          .replace(/\[Organization Name\]/g, selectedOrg)
          .replace(/\[Funder Name\]/g, selectedOrg)
          .replace(/\[District\]/g, 'Andhra Pradesh'),
      };
      setEmail(customized);
      setEditedBody(customized.body);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${editing ? editedBody : email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrgSelect = (name: string) => {
    setSelectedOrg(name);
    const org = allOrgs.find((o) => o.name === name);
    if (org) setSelectedType(org.type);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>Outreach Generator</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          AI-crafted professional outreach emails for maternal health partnerships
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Config */}
        <div className="space-y-4">
          {/* Organization Selector */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#0f172a' }}>Select Organization</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Organization</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none"
                    style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
                    value={selectedOrg}
                    onChange={(e) => handleOrgSelect(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  >
                    <option value="">Select an organization...</option>
                    <optgroup label="Healthcare Entities">
                      {mockEntities.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </optgroup>
                    <optgroup label="NGOs">
                      {mockNGOs.map((n) => <option key={n.id} value={n.name}>{n.name}</option>)}
                    </optgroup>
                    <optgroup label="Funders">
                      {mockFunders.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </optgroup>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94a3b8' }} />
                </div>
              </div>

              {selectedOrg && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                  <Building2 size={14} style={{ color: '#0d9488' }} />
                  <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{selectedOrg}</span>
                  {selectedType && <TypeBadge type={selectedType} />}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!selectedOrg || generating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: selectedOrg && !generating ? 'linear-gradient(135deg, #0f766e, #0d9488)' : '#e2e8f0',
                  color: selectedOrg && !generating ? 'white' : '#94a3b8',
                }}
              >
                {generating ? <LoadingSpinner size={16} color="white" /> : <Sparkles size={16} />}
                {generating ? 'Generating with AI...' : 'Generate Email'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#0f172a' }}>AI Email Features</h3>
            <ul className="space-y-2">
              {[
                'Customized for organization type',
                'Includes specific program benefits',
                'Professional tone & formatting',
                'Editable before sending',
                'One-click copy to clipboard',
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#0d9488' }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Email Preview */}
        <div>
          {!email && !generating && (
            <div
              className="card p-12 flex flex-col items-center justify-center text-center h-full"
              style={{ minHeight: 300 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: '#f0fdfa' }}
              >
                <Mail size={28} style={{ color: '#0d9488' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#0f172a' }}>Ready to Generate</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Select an organization and click Generate Email to create a professional outreach email.
              </p>
            </div>
          )}

          {generating && (
            <div
              className="card p-12 flex flex-col items-center justify-center text-center h-full"
              style={{ minHeight: 300 }}
            >
              <LoadingSpinner size={36} />
              <p className="mt-4 font-medium" style={{ color: '#0f172a' }}>Generating email...</p>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>GPT-4 is crafting your outreach</p>
            </div>
          )}

          {email && !generating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Email Header */}
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#0d9488' }} />
                    <span className="text-xs font-medium" style={{ color: '#64748b' }}>AI Generated Email</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(!editing)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs"
                      style={{ background: editing ? '#f0fdfa' : '#f1f5f9', color: editing ? '#0d9488' : '#64748b' }}
                    >
                      <Edit3 size={11} /> {editing ? 'Preview' : 'Edit'}
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs"
                      style={{ background: '#f1f5f9', color: '#64748b' }}
                    >
                      <RefreshCw size={11} /> Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: copied ? '#f0fdf4' : '#0d9488', color: copied ? '#059669' : 'white' }}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'white', border: '1px solid #e2e8f0' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#64748b' }}>Subject: </span>
                  <span className="font-medium" style={{ color: '#0f172a' }}>{email.subject}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-5">
                {editing ? (
                  <textarea
                    className="w-full text-sm resize-none"
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: 16,
                      outline: 'none',
                      color: '#0f172a',
                      lineHeight: 1.7,
                      minHeight: 400,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                ) : (
                  <pre
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: '#374151', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {editing ? editedBody : email.body}
                  </pre>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid #f1f5f9' }}
              >
                <span className="text-xs" style={{ color: '#94a3b8' }}>
                  Generated by GPT-4 • Customize before sending
                </span>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#0d9488' }}
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(editing ? editedBody : email.body)}`)}
                >
                  <Send size={11} /> Open in Mail
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
