import React, { useState, useRef } from 'react';
import { Artifact, ArtifactCategory, AccessPermissionLevel, EmotionalMood } from '../types';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Filter, 
  Search, 
  BookOpen, 
  Heart, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Lock,
  Users,
  Trash2,
  FileCheck,
  File,
  X,
  Brain,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { ArtifactModal } from './ArtifactModal';
import { KnowledgeBaseCoverageModal } from './KnowledgeBaseCoverageModal';

interface VaultViewProps {
  artifacts: Artifact[];
  onAddArtifact: (artifact: Artifact) => void;
  onUpdateArtifact: (artifact: Artifact) => void;
  onDeleteArtifact: (id: string) => void;
  onOpenVisualizer?: () => void;
  onOpenSentiment?: () => void;
}

const ALL_MOODS: EmotionalMood[] = [
  'Raw Grief',
  'Quiet Peace',
  'Defiant Hope',
  'Vulnerable Love',
  'Melancholy',
  'Creative Spark',
  'Bittersweet',
  'Existential Low',
  'Profound Gratitude',
  'Grounding Calm'
];

export const VaultView: React.FC<VaultViewProps> = ({
  artifacts,
  onAddArtifact,
  onUpdateArtifact,
  onDeleteArtifact,
  onOpenVisualizer,
  onOpenSentiment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalArtifact, setActiveModalArtifact] = useState<Artifact | null>(null);
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);

  // Upload state (Supports multi-file queue and direct text)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ArtifactCategory>('lowest_lows');
  const [uploadAccessLevel, setUploadAccessLevel] = useState<AccessPermissionLevel>('friends_and_children');
  const [manualTextEntry, setManualTextEntry] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentFileName: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Coverage statistics
  const totalArtifacts = artifacts.length;
  const integratedCount = artifacts.filter(a => a.isIntegrated !== false).length;
  const coveragePercent = totalArtifacts > 0 ? Math.round((integratedCount / totalArtifacts) * 100) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToStaging(Array.from(e.target.files));
    }
  };

  const addFilesToStaging = (newFiles: File[]) => {
    setUploadError(null);
    setUploadSuccess(null);
    setStagedFiles((prev) => [...prev, ...newFiles]);

    // If first file is image, show preview
    const firstImg = newFiles.find(f => f.type.startsWith('image/'));
    if (firstImg && !previewUrl) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(firstImg);
    }
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
    if (stagedFiles.length <= 1) {
      setPreviewUrl(null);
    }
  };

  const clearStagedFiles = () => {
    setStagedFiles([]);
    setPreviewUrl(null);
    setCustomTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToStaging(Array.from(e.dataTransfer.files));
    }
  };

  const handleAnalyzeAndSave = async () => {
    if (stagedFiles.length === 0 && !manualTextEntry.trim()) {
      setUploadError('Please select files (photos of journals, PDFs, documents) or write text.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (isTextMode && manualTextEntry.trim()) {
        // Direct text submission
        setBatchProgress({ current: 1, total: 1, currentFileName: customTitle || 'Written Reflection' });

        const response = await fetch('/api/gemini/analyze-artifact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText: manualTextEntry.trim(),
            fileName: customTitle || 'Personal Writing',
            categoryHint: uploadCategory,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze text entry');
        }

        const resData = await response.json();
        const analysis = resData.data;

        const newArtifact: Artifact = {
          id: `art-${Date.now()}`,
          title: customTitle || 'Personal Writing',
          category: uploadCategory,
          accessLevel: uploadAccessLevel,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          mediaType: 'text',
          transcription: analysis.transcription || manualTextEntry,
          emotionalState: analysis.emotionalState || 'Intense personal reflection',
          emotionalMood: analysis.emotionalMood || (uploadCategory === 'lowest_lows' ? 'Raw Grief' : 'Quiet Peace'),
          lifeContexts: analysis.lifeContexts || [uploadCategory.replace('_', ' ')],
          triggers: analysis.triggers || [],
          sentimentScore: typeof analysis.sentimentScore === 'number' ? analysis.sentimentScore : (uploadCategory === 'lowest_lows' ? -60 : 30),
          extractedWisdom: analysis.extractedWisdom || '',
          outsideTheBoxInsight: analysis.outsideTheBoxInsight || '',
          tags: analysis.suggestedTags || [uploadCategory],
          perspectiveForFriends: analysis.perspectiveForFriends,
          perspectiveForChildren: analysis.perspectiveForChildren,
          oneSentenceTruth: analysis.oneSentenceTruth,
          createdTimestamp: Date.now(),
          isFavorite: false,
          isIntegrated: true,
        };

        onAddArtifact(newArtifact);
        setUploadSuccess(`Transcribed & integrated: "${newArtifact.title}" into cognitive knowledge base.`);
        setManualTextEntry('');
        setCustomTitle('');
      } else {
        // Batch file processing
        const total = stagedFiles.length;
        let countSaved = 0;

        for (let i = 0; i < total; i++) {
          const file = stagedFiles[i];
          setBatchProgress({ current: i + 1, total, currentFileName: file.name });

          let fileDataUrl: string | undefined = undefined;
          let rawText: string | undefined = undefined;
          const mime = file.type || 'text/plain';

          if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            rawText = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve((reader.result as string) || '');
              reader.readAsText(file);
            });
          } else {
            // Read as data URL (PDFs or images)
            fileDataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve((reader.result as string) || '');
              reader.readAsDataURL(file);
            });
          }

          const fileTitle = stagedFiles.length === 1 && customTitle 
            ? customTitle 
            : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

          const response = await fetch('/api/gemini/analyze-artifact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileDataUrl,
              mimeType: mime,
              rawText,
              fileName: file.name,
              categoryHint: uploadCategory,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed on "${file.name}": ${errorData.error || 'Analysis failed'}`);
          }

          const resData = await response.json();
          const analysis = resData.data;

          const newArtifact: Artifact = {
            id: `art-${Date.now()}-${i}`,
            title: fileTitle,
            category: uploadCategory,
            accessLevel: uploadAccessLevel,
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            mediaType: file.type.startsWith('image/') ? 'image' : (rawText ? 'text' : 'document'),
            fileDataUrl: file.type.startsWith('image/') ? fileDataUrl : undefined,
            fileName: file.name,
            transcription: analysis.transcription || rawText || '',
            emotionalState: analysis.emotionalState || 'Intense personal reflection',
            emotionalMood: analysis.emotionalMood || (uploadCategory === 'lowest_lows' ? 'Raw Grief' : 'Quiet Peace'),
            lifeContexts: analysis.lifeContexts || [uploadCategory.replace('_', ' ')],
            triggers: analysis.triggers || [],
            sentimentScore: typeof analysis.sentimentScore === 'number' ? analysis.sentimentScore : (uploadCategory === 'lowest_lows' ? -60 : 30),
            extractedWisdom: analysis.extractedWisdom || '',
            outsideTheBoxInsight: analysis.outsideTheBoxInsight || '',
            tags: analysis.suggestedTags || [uploadCategory],
            perspectiveForFriends: analysis.perspectiveForFriends,
            perspectiveForChildren: analysis.perspectiveForChildren,
            oneSentenceTruth: analysis.oneSentenceTruth,
            createdTimestamp: Date.now() + i,
            isFavorite: false,
            isIntegrated: true,
          };

          onAddArtifact(newArtifact);
          countSaved++;
        }

        setUploadSuccess(`Successfully transcribed & integrated all ${countSaved} artifacts into your AI replica's core memory!`);
        clearStagedFiles();
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error communicating with AI transcription engine');
    } finally {
      setIsUploading(false);
      setBatchProgress(null);
    }
  };

  const filteredArtifacts = artifacts.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTier = 
      selectedTierFilter === 'all' ||
      (selectedTierFilter === 'children_only' && item.accessLevel === 'children_only') ||
      (selectedTierFilter === 'friends' && (item.accessLevel === 'friends_and_children' || item.accessLevel === 'public_all')) ||
      (selectedTierFilter === 'creator' && item.accessLevel === 'creator_only');

    const matchesMood = 
      selectedMoodFilter === 'all' || item.emotionalMood === selectedMoodFilter;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transcription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.lifeContexts && item.lifeContexts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.triggers && item.triggers.some(trig => trig.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.emotionalMood && item.emotionalMood.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.emotionalState.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTier && matchesMood && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'lowest_lows', label: 'Heart of Lowest Lows' },
    { id: 'children_legacy', label: 'For My Children' },
    { id: 'friends_counsel', label: 'For Friends' },
    { id: 'artwork_creative', label: 'Artwork & Sketches' },
    { id: 'philosophies', label: 'Life Philosophies' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Knowledge Base Coverage Indicator & Quick Action Banner */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Memory Vault & Knowledge Ingestion
                </h2>
              </div>
              <p className="text-stone-500 text-xs pt-0.5">
                Upload handwritten journals, artwork, raw lowest-lows reflections, and personal files
              </p>
            </div>
          </div>

          {/* Knowledge Base Coverage Indicator Button */}
          <button
            type="button"
            id="btn-knowledge-coverage-summary"
            onClick={() => setIsCoverageModalOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-emerald-600 text-xs text-stone-800 font-medium transition shadow-2xs group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Coverage: <strong>{integratedCount}/{totalArtifacts}</strong> ({coveragePercent}%)
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              Active
            </span>
          </button>
        </div>

        {/* Retrospective Core Explanation & Links to Visualizers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-stone-800 flex-1">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-950 font-semibold">Unified Retrospective Core:</strong> The AI always has full access to all uploaded documents, traumas, and joys. It uses them silently in retrospect to synthesize outside-the-box perspective—the reason friends call you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVisualizer && (
              <button
                type="button"
                id="btn-vault-open-visualizer"
                onClick={onOpenVisualizer}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:border-amber-700 bg-white hover:bg-amber-50 text-stone-800 text-xs font-medium transition shadow-2xs"
              >
                <Brain className="w-3.5 h-3.5 text-amber-700" />
                <span>Thought Visualizer (D3)</span>
              </button>
            )}

            {onOpenSentiment && (
              <button
                type="button"
                id="btn-vault-open-sentiment"
                onClick={onOpenSentiment}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:border-teal-700 bg-white hover:bg-teal-50 text-stone-800 text-xs font-medium transition shadow-2xs"
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
                <span>Sentiment Trends (Recharts)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload and Ingestion Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 className="font-serif font-semibold text-stone-900 text-lg flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-800" />
            Ingest New Artifacts & Journal Photos
          </h3>
          <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs font-medium text-stone-600">
            <button
              type="button"
              id="tab-upload-file"
              onClick={() => setIsTextMode(false)}
              className={`px-3 py-1 rounded-md transition ${!isTextMode ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
            >
              Upload Pictures / Docs (Batch)
            </button>
            <button
              type="button"
              id="tab-write-direct"
              onClick={() => setIsTextMode(true)}
              className={`px-3 py-1 rounded-md transition ${isTextMode ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
            >
              Paste / Write Raw Text
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingestion Source */}
          <div className="md:col-span-2 space-y-4">
            {!isTextMode ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-amber-700 bg-stone-50/60 hover:bg-stone-50 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                />

                {stagedFiles.length === 0 ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="font-serif font-medium text-stone-800 text-base">
                      Drop journal photos, art, or PDFs here
                    </div>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Supports multiple photos at once (handwritten journals, sketchbook drawings, articles, raw notes)
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-stone-200 text-stone-800 text-xs font-medium rounded-lg">
                      Select Files (Batch Supported)
                    </span>
                  </div>
                ) : (
                  <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-stone-200">
                      <span className="font-semibold text-stone-800">
                        {stagedFiles.length} File{stagedFiles.length > 1 ? 's' : ''} Selected for Ingestion
                      </span>
                      <button
                        type="button"
                        onClick={clearStagedFiles}
                        className="text-red-700 hover:underline text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 text-left">
                      {stagedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                            <span className="truncate font-medium text-stone-800">{file.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ({Math.round(file.size / 1024)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStagedFile(idx)}
                            className="text-stone-400 hover:text-stone-700 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-amber-800 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add more documents or photos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-stone-700">
                  Raw Journal Excerpt or Low-Point Reflection
                </label>
                <textarea
                  id="textarea-manual-raw-text"
                  rows={9}
                  value={manualTextEntry}
                  onChange={(e) => setManualTextEntry(e.target.value)}
                  placeholder="Pour your heart out here... Write what you felt in your lowest lows, moments of survival, sacred things you want remembered, or personal philosophies."
                  className="w-full text-sm font-serif p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed text-stone-900"
                />
              </div>
            )}

            {/* Batch Progress Bar */}
            {batchProgress && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                    Transcribing & Ingesting ({batchProgress.current} / {batchProgress.total})
                  </span>
                  <span className="font-mono text-stone-600 truncate max-w-[160px]">
                    {batchProgress.currentFileName}
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-800 h-full transition-all duration-300"
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ingestion Meta Configuration */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Artifact Title / Identifier {stagedFiles.length > 1 && '(Leave blank for file names)'}
                </label>
                <input
                  type="text"
                  id="input-artifact-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={stagedFiles.length > 1 ? 'Will use original file names' : 'e.g., Kitchen Floor Journal 2021'}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Memory Category
                </label>
                <select
                  id="select-artifact-category"
                  value={uploadCategory}
                  onChange={(e) => {
                    const val = e.target.value as ArtifactCategory;
                    setUploadCategory(val);
                    if (val === 'children_legacy') {
                      setUploadAccessLevel('children_only');
                    }
                  }}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <option value="lowest_lows">Heart of Lowest Lows (Raw Truth & Survival)</option>
                  <option value="children_legacy">For My Children (Legacy & Eternal Love)</option>
                  <option value="friends_counsel">For Friends (When World is Heavy & Counsel)</option>
                  <option value="artwork_creative">Artwork & Creative Soul</option>
                  <option value="philosophies">Life Philosophies & Musings</option>
                  <option value="memories_history">Personal Memories & Life History</option>
                </select>
              </div>

              {/* Clearance Tier Selection */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center justify-between">
                  <span>Display & Discretion Clearance</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                </label>
                <select
                  id="select-artifact-access-tier"
                  value={uploadAccessLevel}
                  onChange={(e) => setUploadAccessLevel(e.target.value as AccessPermissionLevel)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <option value="friends_and_children">Friends & Children Tier (Viewable by both)</option>
                  <option value="children_only">🕊️ Estranged Children (Sacred / Intimate letter)</option>
                  <option value="creator_only">Private Creator Draft</option>
                </select>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Note: Regardless of tag, the AI replica always integrates the life wisdom internally to deduce its outside-the-box answers.
                </p>
              </div>

              <div className="text-xs text-stone-500 bg-white/70 p-3 rounded-lg border border-stone-200 space-y-1">
                <p className="font-medium text-stone-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Gemini Vision & Lateral Extraction
                </p>
                <p>
                  Transcribes handwritten pages, discerns the emotional state, and extracts your unique outside-the-box reasoning.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-analyze-and-save"
              disabled={isUploading || (stagedFiles.length === 0 && !manualTextEntry.trim())}
              onClick={handleAnalyzeAndSave}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                  Transcribing & Distilling ({stagedFiles.length || 1})...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {stagedFiles.length > 1
                    ? `Transcribe & Save All (${stagedFiles.length} files)`
                    : 'Transcribe & Save to Memory Vault'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 border-b border-stone-200 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`filter-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-stone-800 text-stone-50 shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="search-artifacts-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals, moods, triggers..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
        </div>

        {/* Access Tier Quick Filter & Mood Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Tier Filters */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-stone-400 uppercase tracking-wider font-medium text-[10px]">
              Tier:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTierFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs transition ${
                selectedTierFilter === 'all'
                  ? 'bg-stone-800 text-stone-50 font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({artifacts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTierFilter('children_only')}
              className={`px-2.5 py-1 rounded-full text-xs transition flex items-center gap-1 ${
                selectedTierFilter === 'children_only'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold'
                  : 'bg-rose-50/60 text-rose-700 hover:bg-rose-100 border border-rose-200/50'
              }`}
            >
              <Heart className="w-3 h-3" />
              Child Exclusive ({artifacts.filter(a => a.accessLevel === 'children_only').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTierFilter('friends')}
              className={`px-2.5 py-1 rounded-full text-xs transition flex items-center gap-1 ${
                selectedTierFilter === 'friends'
                  ? 'bg-teal-100 text-teal-900 border border-teal-300 font-semibold'
                  : 'bg-teal-50/60 text-teal-700 hover:bg-teal-100 border border-teal-200/50'
              }`}
            >
              <Users className="w-3 h-3" />
              Friends & Children ({artifacts.filter(a => a.accessLevel === 'friends_and_children' || a.accessLevel === 'public_all').length})
            </button>
          </div>

          {/* Mood Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 uppercase tracking-wider font-medium text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-700" />
              Mood:
            </span>
            <select
              id="select-mood-filter"
              value={selectedMoodFilter}
              onChange={(e) => setSelectedMoodFilter(e.target.value)}
              className="text-xs py-1 px-2.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-700"
            >
              <option value="all">All Emotional Moods</option>
              {ALL_MOODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      {filteredArtifacts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="font-serif text-base text-stone-700">No artifacts found in this category / mood</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Upload your first handwritten journal photo or write a raw memory above to enrich your AI replica.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArtifacts.map((art) => (
            <div
              key={art.id}
              id={`artifact-card-${art.id}`}
              onClick={() => setActiveModalArtifact(art)}
              className="bg-white border border-stone-200/90 hover:border-amber-700/60 rounded-xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Visual Thumbnail if image */}
                {art.fileDataUrl && (
                  <div className="h-36 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                    <img
                      src={art.fileDataUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-stone-500 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {art.category === 'lowest_lows' && 'Lowest Lows'}
                      {art.category === 'children_legacy' && 'For My Children'}
                      {art.category === 'friends_counsel' && 'For Friends'}
                      {art.category === 'artwork_creative' && 'Art & Sketch'}
                      {art.category === 'philosophies' && 'Philosophy'}
                      {art.category === 'memories_history' && 'Life History'}
                    </span>

                    {/* Mood Badge */}
                    {art.emotionalMood && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                        {art.emotionalMood}
                      </span>
                    )}
                  </div>

                  {/* Access Level Badge */}
                  {art.accessLevel === 'children_only' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                      <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                      Child Only
                    </span>
                  ) : art.accessLevel === 'creator_only' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      <Lock className="w-2.5 h-2.5" />
                      Creator Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                      <Users className="w-2.5 h-2.5 text-teal-700" />
                      Friends & Children
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-semibold text-stone-900 text-base leading-snug group-hover:text-amber-900 transition">
                  {art.title}
                </h4>

                <p className="font-serif text-xs text-stone-600 line-clamp-3 leading-relaxed italic">
                  "{art.transcription}"
                </p>

                {/* Outside-the-box insight badge if present */}
                {art.outsideTheBoxInsight && (
                  <div className="text-xs text-amber-950 font-medium bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      <strong className="text-amber-900">Outside-the-box deduction:</strong> {art.outsideTheBoxInsight}
                    </span>
                  </div>
                )}

                {/* Triggers and Life Contexts Chips */}
                {art.triggers && art.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {art.triggers.slice(0, 2).map((trig) => (
                      <span
                        key={trig}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200/60 font-medium"
                      >
                        ⚡ {trig}
                      </span>
                    ))}
                    {art.triggers.length > 2 && (
                      <span className="text-[10px] text-stone-400">
                        +{art.triggers.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span className="truncate max-w-[180px] text-stone-500">
                  {art.emotionalState}
                </span>
                <span className="text-amber-800 font-medium group-hover:underline">
                  View Full Memory &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artifact Modal for detailed inspection and editing */}
      <ArtifactModal
        artifact={activeModalArtifact}
        onClose={() => setActiveModalArtifact(null)}
        onUpdate={(updated) => {
          onUpdateArtifact(updated);
          setActiveModalArtifact(updated);
        }}
        onDelete={(id) => {
          onDeleteArtifact(id);
          setActiveModalArtifact(null);
        }}
      />

      {/* Knowledge Base Coverage Modal */}
      <KnowledgeBaseCoverageModal
        isOpen={isCoverageModalOpen}
        onClose={() => setIsCoverageModalOpen(false)}
        artifacts={artifacts}
        onOpenVisualizer={onOpenVisualizer}
        onOpenSentiment={onOpenSentiment}
      />
    </div>
  );
};
