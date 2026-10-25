import React, { useState } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  User, 
  Brain, 
  Mic, 
  BookMarked, 
  Share2, 
  Activity, 
  Sliders, 
  Scale, 
  CheckSquare, 
  ShieldCheck, 
  HeartHandshake, 
  Cpu, 
  ExternalLink,
  Sparkles,
  PauseCircle,
  PlayCircle,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

export type MainTab = 
  | 'chat' 
  | 'vault' 
  | 'person_model' 
  | 'cognitive_model' 
  | 'voice_lab' 
  | 'wisdom' 
  | 'visualizer' 
  | 'emotional_context' 
  | 'calibration' 
  | 'constitution' 
  | 'review_queue' 
  | 'security' 
  | 'testament'
  | 'control_center';

interface NavigationProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  artifactCount: number;
  pendingReviewCount?: number;
  systemState: string;
  onTogglePause: () => void;
  onEnterRecipientMode: () => void;
  onOpenFirstRunGuide?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  artifactCount,
  pendingReviewCount = 0,
  systemState,
  onTogglePause,
  onEnterRecipientMode,
  onOpenFirstRunGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'chat' as MainTab, label: 'Simulator', icon: MessageSquare },
    { id: 'vault' as MainTab, label: 'Memory Vault', icon: BookOpen, badge: artifactCount },
    { id: 'person_model' as MainTab, label: 'Person Model', icon: User },
    { id: 'cognitive_model' as MainTab, label: 'Cognitive Model', icon: Brain },
    { id: 'voice_lab' as MainTab, label: 'Voice Lab', icon: Mic },
    { id: 'wisdom' as MainTab, label: 'Wisdom', icon: BookMarked },
    { id: 'visualizer' as MainTab, label: 'Thought Graph', icon: Share2 },
    { id: 'emotional_context' as MainTab, label: 'Emotional Context', icon: Activity },
    { id: 'calibration' as MainTab, label: 'Calibration Lab', icon: Sliders },
    { id: 'constitution' as MainTab, label: 'Constitution', icon: Scale },
    { id: 'review_queue' as MainTab, label: 'Review Queue', icon: CheckSquare, badge: pendingReviewCount > 0 ? pendingReviewCount : undefined, badgeColor: 'bg-amber-600 text-stone-900' },
    { id: 'security' as MainTab, label: 'Access & Privacy', icon: ShieldCheck },
    { id: 'testament' as MainTab, label: 'Testament', icon: HeartHandshake },
    { id: 'control_center' as MainTab, label: 'Control Center', icon: Cpu },
  ];

  const handleSelect = (tab: MainTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-stone-800 bg-stone-950 text-stone-100 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSelect('chat')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-stone-950 flex items-center justify-center font-serif text-base font-bold shadow transition-transform group-hover:scale-105">
                Ψ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-stone-100 text-sm sm:text-base tracking-tight">
                    SOUL REPLICA
                  </span>
                  <span className="text-xs text-amber-400/90 font-serif italic">for Lacey</span>
                </div>
                <p className="text-[10px] text-stone-400 hidden sm:block font-mono">
                  Fidelity &gt; Flattery • Version 1.5.0
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${item.badgeColor || 'bg-stone-800 text-stone-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary / Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenFirstRunGuide && (
              <button
                type="button"
                onClick={onOpenFirstRunGuide}
                title="First-Run Setup Guide: I don't know you yet"
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 hover:bg-stone-800 transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline font-mono">Guide</span>
              </button>
            )}

            <button
              type="button"
              onClick={onTogglePause}
              title={systemState === 'paused' ? 'Resume Simulation' : 'Emergency Pause Simulation'}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-mono ${
                systemState === 'paused'
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 font-bold animate-pulse'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {systemState === 'paused' ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>PAUSED</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-nav-recipient-mode"
              onClick={onEnterRecipientMode}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-amber-800/80 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Recipient Mode</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-800 bg-stone-950 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${item.badgeColor || 'bg-stone-800 text-stone-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
