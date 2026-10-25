import React, { useState } from 'react';
import { WisdomModule, RelationshipRole } from '../types';
import { BookOpen, Shield, CheckCircle2, AlertCircle, Plus, Users, Clock } from 'lucide-react';

interface WisdomModulesViewProps {
  wisdomModules: WisdomModule[];
  onUpdateWisdomModules?: (modules: WisdomModule[]) => void;
}

export const WisdomModulesView: React.FC<WisdomModulesViewProps> = ({
  wisdomModules,
  onUpdateWisdomModules,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(wisdomModules[0]?.id || '');
  const [showAddPrinciple, setShowAddPrinciple] = useState(false);
  const [newPrincipleText, setNewPrincipleText] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newExceptions, setNewExceptions] = useState('');

  const activeModule = wisdomModules.find((m) => m.id === selectedModuleId) || wisdomModules[0];

  const handleAddPrinciple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrincipleText.trim() || !newExplanation.trim() || !activeModule) return;

    const newPrinciple = {
      id: `prin-${Date.now()}`,
      principle: newPrincipleText,
      explanation: newExplanation,
      evidenceSummary: 'Directly ratified by creator in Wisdom Module.',
      exceptions: newExceptions || 'None documented.',
      creatorApproval: true,
    };

    const updated = wisdomModules.map((m) => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          principles: [...m.principles, newPrinciple],
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return m;
    });

    if (onUpdateWisdomModules) {
      onUpdateWisdomModules(updated);
    }

    setNewPrincipleText('');
    setNewExplanation('');
    setNewExceptions('');
    setShowAddPrinciple(false);
  };

  return (
    <div id="wisdom-modules-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="wisdom-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                Layer 2: Model • Modular Principles
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {wisdomModules.length} Modules Active
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Wisdom Modules</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Modular, role-gated collections of creator-approved principles, life strategies, and non-negotiables. 
              Each module explicitly details real-world exceptions and preserves authentic contradictions.
            </p>
          </div>
        </div>
      </div>

      {/* Module Selector & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Modules List */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block px-2 mb-2">Available Modules</span>
          {wisdomModules.map((module) => (
            <button
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedModuleId === module.id
                  ? 'bg-stone-800/90 border-amber-500/80 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-800/40 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-serif font-medium ${selectedModuleId === module.id ? 'text-amber-200' : 'text-stone-300'}`}>
                  {module.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                  v{module.version}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span>{module.principles.length} principles</span>
                <span>•</span>
                <span className="capitalize">{module.topic}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Pane: Active Module Content */}
        {activeModule && (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-serif text-stone-100">{activeModule.title}</h2>
                  <p className="text-stone-400 text-sm mt-1">{activeModule.creatorNotes}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowAddPrinciple(!showAddPrinciple)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Principle
                  </button>
                </div>
              </div>

              {/* Permitted Roles & Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>Permitted Roles:</span>
                  {activeModule.permittedRoles.map((role) => (
                    <span key={role} className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 capitalize">
                      {role.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Last Updated: {activeModule.lastUpdated}</span>
                </div>
              </div>

              {/* Add Principle Form */}
              {showAddPrinciple && (
                <form onSubmit={handleAddPrinciple} className="bg-stone-950/80 border border-amber-800/60 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    Draft New Approved Principle
                  </h3>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Core Principle Statement</label>
                    <input
                      type="text"
                      value={newPrincipleText}
                      onChange={(e) => setNewPrincipleText(e.target.value)}
                      placeholder="e.g. Real Friendship Allows for Silence"
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Detailed Explanation & Nuance</label>
                    <textarea
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Explain how this applies in lived reality without generic platitudes..."
                      rows={3}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Recognized Exceptions (Crucial for Fidelity)</label>
                    <input
                      type="text"
                      value={newExceptions}
                      onChange={(e) => setNewExceptions(e.target.value)}
                      placeholder="When does this principle NOT apply? (e.g. Acute physical emergencies)"
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPrinciple(false)}
                      className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold rounded-lg text-xs"
                    >
                      Ratify Principle
                    </button>
                  </div>
                </form>
              )}

              {/* Principles List */}
              <div className="space-y-4">
                {activeModule.principles.map((p) => (
                  <div key={p.id} className="bg-stone-950/60 border border-stone-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-serif text-amber-200 font-medium">{p.principle}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Creator Approved
                      </span>
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">{p.explanation}</p>
                    
                    {p.exceptions && (
                      <div className="p-3 bg-stone-900/60 rounded-lg border border-stone-800/80 text-xs space-y-1">
                        <span className="font-mono text-amber-400 uppercase tracking-wider block">Explicit Exceptions:</span>
                        <p className="text-stone-400">{p.exceptions}</p>
                      </div>
                    )}

                    {p.contradictions && (
                      <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-900/40 text-xs space-y-1">
                        <span className="font-mono text-rose-400 uppercase tracking-wider block">Preserved Tension:</span>
                        <p className="text-rose-200/90">{p.contradictions}</p>
                      </div>
                    )}

                    <div className="text-[11px] font-mono text-stone-500 pt-1">
                      {p.evidenceSummary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
