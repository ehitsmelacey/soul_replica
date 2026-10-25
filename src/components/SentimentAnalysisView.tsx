import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { Artifact } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Heart, 
  Activity, 
  Compass, 
  ArrowUpRight, 
  ShieldCheck, 
  Brain 
} from 'lucide-react';

interface SentimentAnalysisViewProps {
  artifacts: Artifact[];
  onSelectArtifact?: (artifact: Artifact) => void;
  onOpenVisualizer?: () => void;
}

export const SentimentAnalysisView: React.FC<SentimentAnalysisViewProps> = ({
  artifacts,
  onSelectArtifact,
  onOpenVisualizer,
}) => {
  // Chronologically sorted data for timeline
  const timelineData = useMemo(() => {
    const list = [...artifacts].sort((a, b) => {
      const timeA = a.createdTimestamp || 0;
      const timeB = b.createdTimestamp || 0;
      return timeA - timeB;
    });

    return list.map((art, idx) => {
      const score = typeof art.sentimentScore === 'number' 
        ? art.sentimentScore 
        : (art.category === 'lowest_lows' ? -65 : art.category === 'children_legacy' ? 60 : 30);

      // Resilience index: converts raw experience into wisdom index
      const resilience = Math.min(100, Math.max(10, Math.round(50 + score * 0.4 + (art.outsideTheBoxInsight ? 25 : 10))));

      return {
        id: art.id,
        title: art.title,
        date: art.date || `Entry #${idx + 1}`,
        rawDate: art.createdTimestamp,
        sentimentScore: score,
        resilienceScore: resilience,
        mood: art.emotionalMood || 'Quiet Peace',
        category: art.category,
        oneSentenceTruth: art.oneSentenceTruth || art.extractedWisdom,
        outsideTheBoxInsight: art.outsideTheBoxInsight,
        rawArtifact: art,
      };
    });
  }, [artifacts]);

  // Emotional Mood Distribution
  const moodDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    artifacts.forEach(a => {
      const mood = a.emotionalMood || 'Uncategorized';
      counts[mood] = (counts[mood] || 0) + 1;
    });

    return Object.entries(counts).map(([mood, count]) => ({
      mood,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [artifacts]);

  const earliest = timelineData[0];
  const latest = timelineData[timelineData.length - 1];
  const netDelta = (latest?.sentimentScore ?? 0) - (earliest?.sentimentScore ?? 0);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Raw Grief': return '#b45309'; // amber-700
      case 'Quiet Peace': return '#0f766e'; // teal-700
      case 'Defiant Hope': return '#0284c7'; // sky-600
      case 'Vulnerable Love': return '#e11d48'; // rose-600
      case 'Melancholy': return '#64748b'; // slate-500
      case 'Creative Spark': return '#7c3aed'; // purple-600
      case 'Bittersweet': return '#d97706'; // amber-600
      case 'Existential Low': return '#451a03'; // amber-950
      case 'Profound Gratitude': return '#15803d'; // green-700
      default: return '#78716c';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-900 text-teal-50 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Sentiment & Emotional Trajectory
            </h2>
            <p className="text-xs text-stone-500">
              Tracking how raw writings from lowest lows transformed into grounded wisdom and unconditional peace
            </p>
          </div>
        </div>

        {onOpenVisualizer && (
          <button
            type="button"
            id="btn-sentiment-to-d3"
            onClick={onOpenVisualizer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 text-stone-800 text-xs font-medium transition shadow-2xs"
          >
            <Brain className="w-3.5 h-3.5 text-amber-800" />
            <span>View Thought Process Visualizer (D3)</span>
          </button>
        )}
      </div>

      {/* Trajectory Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-stone-400" />
            Earliest Recorded Tone
          </div>
          <div className="text-xl font-serif font-bold text-stone-900 flex items-baseline gap-2">
            <span>{earliest?.sentimentScore ? (earliest.sentimentScore > 0 ? `+${earliest.sentimentScore}` : earliest.sentimentScore) : 'N/A'}</span>
            <span className="text-xs font-sans text-amber-800 font-medium">
              ({earliest?.mood})
            </span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">
            "{earliest?.title}"
          </p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-stone-400" />
            Latest Reflection Tone
          </div>
          <div className="text-xl font-serif font-bold text-stone-900 flex items-baseline gap-2">
            <span>{latest?.sentimentScore ? (latest.sentimentScore > 0 ? `+${latest.sentimentScore}` : latest.sentimentScore) : 'N/A'}</span>
            <span className="text-xs font-sans text-teal-800 font-medium">
              ({latest?.mood})
            </span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">
            "{latest?.title}"
          </p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            Transformation Shift
          </div>
          <div className="text-xl font-serif font-bold text-emerald-800 flex items-baseline gap-2">
            <span>{netDelta > 0 ? `+${netDelta}` : netDelta} pts</span>
            <span className="text-xs font-sans text-stone-500 font-normal">
              valency progression
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Survival experiences forged into unconditional perspective
          </p>
        </div>
      </div>

      {/* Primary Timeline Chart (Recharts AreaChart) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Personal Tone & Valency Over Time
            </h3>
            <p className="text-xs text-stone-500">
              Shifts from dark valley hours (-100) to grounded peace, unconditional love, and transcendence (+100)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <span className="text-stone-700">Valence Score (-100 to +100)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="text-stone-700">Wisdom Index (0-100)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWisdom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis 
                dataKey="date" 
                stroke="#a8a29e" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                domain={[-100, 100]} 
                stroke="#a8a29e" 
                fontSize={11} 
                tickLine={false} 
              />
              <ReferenceLine y={0} stroke="#d6d3d1" strokeDasharray="4 4" label={{ value: 'Emotional Equilibrium (0)', position: 'insideBottomLeft', fill: '#a8a29e', fontSize: 10 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-stone-900 text-stone-50 border border-stone-700 rounded-xl p-3 shadow-xl max-w-xs space-y-1.5 text-xs">
                        <div className="font-serif font-bold text-sm text-amber-200">
                          {data.title}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {data.date} • <span className="text-amber-300 font-medium">{data.mood}</span>
                        </div>
                        <div className="flex items-center gap-3 pt-1 border-t border-stone-800 text-[11px]">
                          <span>Valence: <strong className="text-amber-400">{data.sentimentScore > 0 ? `+${data.sentimentScore}` : data.sentimentScore}</strong></span>
                          <span>Wisdom: <strong className="text-teal-400">{data.resilienceScore}</strong></span>
                        </div>
                        {data.oneSentenceTruth && (
                          <div className="text-[11px] text-stone-300 italic pt-1 border-t border-stone-800">
                            "{data.oneSentenceTruth}"
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="sentimentScore" 
                stroke="#d97706" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorValence)" 
              />
              <Area 
                type="monotone" 
                dataKey="resilienceScore" 
                stroke="#0d9488" 
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorWisdom)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Distribution & Interactive Entries List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Distribution Bar Chart */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Emotional Mood Distribution
            </h3>
            <p className="text-xs text-stone-500">
              Frequency of emotional states across all memories
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={moodDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis type="number" stroke="#a8a29e" fontSize={11} />
                <YAxis 
                  dataKey="mood" 
                  type="category" 
                  stroke="#78716c" 
                  fontSize={10} 
                  tickLine={false} 
                  width={90}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} Artifacts`, 'Count']}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #44403c', color: '#f5f5f4', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {moodDistribution.map((entry) => (
                    <Cell key={`cell-${entry.mood}`} fill={getMoodColor(entry.mood)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chronological Artifact Journey Cards */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Chronological Memory Journey
            </h3>
            <span className="text-xs text-stone-500">
              {timelineData.length} records synthesized
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {timelineData.map((item) => {
              const isPositive = item.sentimentScore >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectArtifact && onSelectArtifact(item.rawArtifact)}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50/30 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-serif font-bold text-stone-900 group-hover:text-amber-900 transition">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-medium border" style={{ backgroundColor: `${getMoodColor(item.mood)}15`, color: getMoodColor(item.mood), borderColor: `${getMoodColor(item.mood)}30` }}>
                        {item.mood}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-1 italic">
                      "{item.oneSentenceTruth}"
                    </p>
                  </div>

                  <div className="text-right whitespace-nowrap pl-2">
                    <span className={`text-xs font-mono font-bold ${isPositive ? 'text-teal-700' : 'text-amber-800'}`}>
                      {isPositive ? `+${item.sentimentScore}` : item.sentimentScore}
                    </span>
                    <div className="text-[10px] text-stone-400">
                      {item.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
