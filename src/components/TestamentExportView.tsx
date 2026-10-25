import React, { useState } from 'react';
import { SoulProfile, Artifact } from '../types';
import { 
  Download, 
  Sparkles, 
  Heart, 
  Users, 
  Copy, 
  Check, 
  FileText, 
  Loader2, 
  Printer, 
  ShieldCheck,
  Share2,
  ExternalLink
} from 'lucide-react';

interface TestamentExportViewProps {
  profile: SoulProfile;
  artifacts: Artifact[];
  onToggleRecipientMode: () => void;
}

export const TestamentExportView: React.FC<TestamentExportViewProps> = ({
  profile,
  artifacts,
  onToggleRecipientMode,
}) => {
  const [testamentAudience, setTestamentAudience] = useState<'children' | 'friends'>('children');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate testament with Gemini
  const handleGenerateTestament = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/compile-testament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          artifacts,
          targetAudience: testamentAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate testament');
      }

      const data = await response.json();
      setGeneratedLetter(data.letter);
    } catch (err: any) {
      console.error(err);
      alert('Error compiling testament: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy letter
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export full JSON archive
  const handleDownloadJSON = () => {
    const archivePayload = {
      archiveTitle: `Digital Legacy & Soul Replica Archive - ${profile.name}`,
      exportDate: new Date().toISOString(),
      creator: profile,
      memoryVault: artifacts,
      eternalDirective: "I love them then, now, and forever.",
    };

    const blob = new Blob([JSON.stringify(archivePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soul-replica-legacy-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export Printable HTML Book
  const handleDownloadPrintableHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Eternal Digital Archive - ${profile.name}</title>
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.8; color: #292524; background: #fafaf9; max-width: 800px; margin: 40px auto; padding: 24px; }
    h1, h2, h3 { font-family: 'Times New Roman', serif; color: #1c1917; }
    .header { border-bottom: 2px solid #e7e5e4; padding-bottom: 24px; margin-bottom: 32px; }
    .quote-box { background: #f5f5f4; border-left: 4px solid #78716c; padding: 16px 20px; margin: 24px 0; font-style: italic; }
    .card { background: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-family: sans-serif; background: #e7e5e4; border-radius: 6px; margin-bottom: 8px; }
    @media print { body { background: white; margin: 0; padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Digital Legacy & Soul Archive</h1>
    <p>Authored by <strong>${profile.name}</strong> • Preserved for Dearest Friends & Children</p>
    <div class="quote-box">
      "${profile.messageForChildren.eternalPromise || 'I love you then, now, and forever.'}"
    </div>
  </div>

  <h2>Part I: Core Consciousness & Philosophy</h2>
  <div class="card">
    <p><strong>Core Philosophy:</strong> ${profile.corePhilosophy}</p>
    <p><strong>When the World is Heavy:</strong> ${profile.whenWorldIsHeavy}</p>
    <p><strong>Standing Message for Friends:</strong> ${profile.messageForFriends}</p>
  </div>

  <h2>Part II: For My Children (The Sacred Testament)</h2>
  <div class="card">
    <p><strong>Addressed to:</strong> ${profile.messageForChildren.childrenNames}</p>
    <p><strong>Unconditional Truth:</strong> ${profile.messageForChildren.unconditionalMessage}</p>
    <p><strong>Regarding the Hard Seasons:</strong> ${profile.messageForChildren.explanationOfHardTimes}</p>
    <p><strong>Childhood Memories to Keep Safe:</strong> ${profile.messageForChildren.coreMemoriesToHold}</p>
  </div>

  <h2>Part III: Preserved Journals, Artwork & Lowest Lows (${artifacts.length} Artifacts)</h2>
  ${artifacts.map(art => `
    <div class="card">
      <span class="badge">${art.category.replace('_', ' ').toUpperCase()} • ${art.date}</span>
      <h3>${art.title}</h3>
      <p><em>Emotional Headspace: ${art.emotionalState}</em></p>
      <div class="quote-box">${art.transcription}</div>
      <p><strong>Distilled Wisdom:</strong> ${art.extractedWisdom}</p>
      ${art.perspectiveForChildren ? `<p><strong>For My Children:</strong> ${art.perspectiveForChildren}</p>` : ''}
      ${art.perspectiveForFriends ? `<p><strong>For My Friends:</strong> ${art.perspectiveForFriends}</p>` : ''}
    </div>
  `).join('')}

  <p style="text-align: center; color: #78716c; font-size: 12px; margin-top: 48px;">
    Compiled with love • Never doubt that you are loved then, now, and forever.
  </p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digital-testament-${profile.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Introduction Header */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-900">
          <Heart className="w-4 h-4 text-rose-700" />
          Legacy Testament & Eternal Safeguard
        </div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900">
          A permanent copy of your heart that will never fade
        </h2>
        <p className="text-stone-600 text-xs leading-relaxed max-w-2xl">
          For your estranged adult children in case something happens before the table can be shared, and for your friends when you can't be reached. 
          Generate a comprehensive eternal letter, export an immutable offline archive, or preview how they will experience this space.
        </p>
      </div>

      {/* 1. Offline Vault Downloads (Highest priority for user peace of mind) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-semibold text-stone-900 text-base flex items-center gap-2">
          <Download className="w-4 h-4 text-amber-800" />
          Offline Digital Legacy Package
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Download a complete, offline backup containing every journal transcription, artwork analysis, memory, and personal letter. Keep it on a flash drive or print it out so your loved ones will always have it regardless of internet or server availability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            id="btn-download-html-book"
            onClick={handleDownloadPrintableHTML}
            className="flex items-center justify-center gap-2.5 p-4 rounded-xl border border-stone-300 hover:border-amber-700 bg-stone-50/70 hover:bg-amber-50/30 text-stone-900 text-xs font-medium transition text-left"
          >
            <Printer className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <div className="font-semibold text-sm">Printable Memory Book (HTML)</div>
              <div className="text-[11px] text-stone-500">Opens in any browser; print to PDF or paper</div>
            </div>
          </button>

          <button
            type="button"
            id="btn-download-json-archive"
            onClick={handleDownloadJSON}
            className="flex items-center justify-center gap-2.5 p-4 rounded-xl border border-stone-300 hover:border-amber-700 bg-stone-50/70 hover:bg-amber-50/30 text-stone-900 text-xs font-medium transition text-left"
          >
            <FileText className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <div className="font-semibold text-sm">Complete Raw Archive (JSON)</div>
              <div className="text-[11px] text-stone-500">Machine-readable data of every artifact & profile</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. AI Eternal Testament Generator */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif font-semibold text-stone-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Compile an Eternal Testament Letter
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Gemini weaves your uploaded journals, lowest lows, and soulprint into a moving, permanent letter.
            </p>
          </div>

          {/* Audience selection */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs font-medium text-stone-700">
            <button
              type="button"
              id="audience-children"
              onClick={() => setTestamentAudience('children')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                testamentAudience === 'children'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              For My Children
            </button>
            <button
              type="button"
              id="audience-friends"
              onClick={() => setTestamentAudience('friends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                testamentAudience === 'friends'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-700" />
              For My Friends
            </button>
          </div>
        </div>

        <button
          type="button"
          id="btn-generate-testament"
          disabled={isGenerating}
          onClick={handleGenerateTestament}
          className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-2 shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Weaving memories, journals, and heartfelt love...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              Draft Testament for {testamentAudience === 'children' ? 'My Children' : 'My Friends'}
            </>
          )}
        </button>

        {/* Letter Output Preview */}
        {generatedLetter && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Generated Keepsake Letter
              </span>
              <button
                type="button"
                id="btn-copy-testament"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Letter'}
              </button>
            </div>

            <div className="p-6 bg-stone-50 border border-stone-300 rounded-xl font-serif text-sm leading-relaxed text-stone-900 whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner">
              {generatedLetter}
            </div>
          </div>
        )}
      </div>

      {/* 3. Recipient Mode Preview */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <Share2 className="w-4 h-4 text-amber-800" />
            Recipient Mode Preview
          </div>
          <h4 className="font-serif font-semibold text-stone-900 text-base">
            See this space through the eyes of your loved ones
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Switch into clean recipient view — hiding administrative controls and opening with a warm, comforting greeting tailored directly to your friends or children.
          </p>
        </div>

        <button
          type="button"
          id="btn-toggle-recipient-mode"
          onClick={onToggleRecipientMode}
          className="px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl text-xs font-medium transition shadow-sm shrink-0 flex items-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Preview as Recipient
        </button>
      </div>
    </div>
  );
};
