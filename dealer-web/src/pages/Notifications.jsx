import { useState } from 'react';
import { Bell, MessageCircle, Send, Plus, CheckCircle2 } from 'lucide-react';
import { notifications } from '../data/mockData';

const TYPE_ICONS = {
  whatsapp: { label: 'WhatsApp', color: 'text-green-600 bg-green-50', icon: MessageCircle },
  sms: { label: 'SMS', color: 'text-blue-600 bg-blue-50', icon: Bell },
};

export default function Notifications() {
  const [target, setTarget] = useState('all');
  const [channel, setChannel] = useState('whatsapp');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
        <p className="text-sm text-slate-500">Send bulk messages to customers via WhatsApp or SMS</p>
      </div>

      {sent && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Message sent successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Compose */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-700">Compose Message</h2>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Channel</label>
            <div className="flex gap-2">
              {[{ key: 'whatsapp', label: 'WhatsApp' }, { key: 'sms', label: 'SMS' }].map(c => (
                <button
                  key={c.key}
                  onClick={() => setChannel(c.key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${channel === c.key ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Recipients</label>
            <select value={target} onChange={e => setTarget(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
              <option value="all">All Active Customers (9)</option>
              <option value="zone">By Zone</option>
              <option value="dues">Has Outstanding Dues (3)</option>
              <option value="lowwallet">Low Wallet Balance (2)</option>
            </select>
          </div>

          {target === 'zone' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Zone</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
                <option>Anna Nagar East</option>
                <option>Anna Nagar West</option>
                <option>Kilpauk</option>
                <option>Aminjikarai</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message here..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{message.length}/160</p>
          </div>

          {/* Templates */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-2">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Price increase effective July 1st.',
                'No delivery on {{date}} (holiday).',
                'Your dues are pending. Please pay.',
                'Delivery delayed by 1 hour today.',
              ].map(t => (
                <button
                  key={t}
                  onClick={() => setMessage(t)}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  {t.slice(0, 30)}…
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 mb-4">Message History</h2>
          <div className="space-y-4">
            {notifications.map(n => {
              const cfg = TYPE_ICONS[n.type];
              return (
                <div key={n.id} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.color}`}>
                        <cfg.icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium text-slate-700">{cfg.label}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${n.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {n.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{n.message}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{n.sentAt || 'Draft'}</span>
                    {n.recipients > 0 && <span>{n.recipients} recipients</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
