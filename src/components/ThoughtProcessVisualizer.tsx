import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Artifact, EmotionalMood } from '../types';
import { 
  Brain, 
  Sparkles, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  Heart, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'core' | 'trauma' | 'joy' | 'art_philosophy' | 'context_trigger' | 'perspective';
  category?: string;
  mood?: EmotionalMood | string;
  sourceArtifact?: Artifact;
  description: string;
  adviceForFriends?: string;
  adviceForChildren?: string;
  outsideTheBox?: string;
  sentiment?: number;
  radius: number;
  color: string;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  id: string;
  source: string | NodeData;
  target: string | NodeData;
  relationType: 'forged_by_trauma' | 'illuminated_by_joy' | 'triggered_by' | 'synthesized_to';
  label: string;
  strength?: number;
}

interface ThoughtProcessVisualizerProps {
  artifacts: Artifact[];
  onSelectArtifact?: (artifact: Artifact) => void;
  onNavigateToChat?: () => void;
}

export const ThoughtProcessVisualizer: React.FC<ThoughtProcessVisualizerProps> = ({
  artifacts,
  onSelectArtifact,
  onNavigateToChat,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'traumas' | 'joys' | 'perspectives'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Build Graph Data from live artifacts
  const { nodes, links } = useMemo(() => {
    const nList: NodeData[] = [];
    const lList: LinkData[] = [];

    // Central Persona Core Node
    nList.push({
      id: 'node-core',
      label: 'Soul Replica Core',
      type: 'core',
      description: 'Unified retrospective cognitive model holding all memories, lowest lows, and outside-the-box mindsets.',
      radius: 28,
      color: '#1c1917', // stone-900
    });

    // Create Nodes from Artifacts
    artifacts.forEach((art, idx) => {
      const isTrauma = art.category === 'lowest_lows' || (art.sentimentScore !== undefined && art.sentimentScore < -30);
      const isJoy = art.category === 'children_legacy' || (art.sentimentScore !== undefined && art.sentimentScore > 40);
      
      let nodeType: NodeData['type'] = 'art_philosophy';
      let nodeColor = '#6366f1'; // indigo-500

      if (isTrauma) {
        nodeType = 'trauma';
        nodeColor = '#b45309'; // amber-700
      } else if (isJoy) {
        nodeType = 'joy';
        nodeColor = '#e11d48'; // rose-600
      } else if (art.category === 'artwork_creative') {
        nodeType = 'art_philosophy';
        nodeColor = '#7c3aed'; // purple-600
      } else if (art.category === 'friends_counsel') {
        nodeColor = '#0f766e'; // teal-700
      }

      const artNodeId = `art-node-${art.id}`;
      nList.push({
        id: artNodeId,
        label: art.title,
        type: nodeType,
        category: art.category,
        mood: art.emotionalMood,
        sourceArtifact: art,
        description: art.transcription.slice(0, 180) + '...',
        adviceForFriends: art.perspectiveForFriends,
        adviceForChildren: art.perspectiveForChildren,
        outsideTheBox: art.outsideTheBoxInsight || art.extractedWisdom,
        sentiment: art.sentimentScore,
        radius: 20,
        color: nodeColor,
      });

      // Link to Core
      lList.push({
        id: `link-core-${art.id}`,
        source: 'node-core',
        target: artNodeId,
        relationType: isTrauma ? 'forged_by_trauma' : isJoy ? 'illuminated_by_joy' : 'synthesized_to',
        label: isTrauma ? 'Grounds Resilience' : isJoy ? 'Anchors Devotion' : 'Informs Perspective',
        strength: 0.8,
      });

      // Perspective Deduction Node (Outside-The-Box Insight)
      if (art.outsideTheBoxInsight) {
        const perspectiveNodeId = `perspective-${art.id}`;
        nList.push({
          id: perspectiveNodeId,
          label: `Perspective: ${art.title.replace(/^(Journal:|Letter:|Note for Friends:|Artwork:|Deep Memory:)\s*/i, '').slice(0, 26)}...`,
          type: 'perspective',
          sourceArtifact: art,
          description: art.outsideTheBoxInsight,
          adviceForFriends: art.perspectiveForFriends,
          adviceForChildren: art.perspectiveForChildren,
          outsideTheBox: art.outsideTheBoxInsight,
          radius: 14,
          color: '#d97706', // amber-600
        });

        // Link from Artifact to its derived perspective
        lList.push({
          id: `link-art-persp-${art.id}`,
          source: artNodeId,
          target: perspectiveNodeId,
          relationType: 'synthesized_to',
          label: 'Deduces Outside-the-Box Insight',
          strength: 1.0,
        });
      }

      // Life Context / Trigger Intermediaries
      if (art.triggers && art.triggers.length > 0) {
        art.triggers.slice(0, 2).forEach((trig, tIdx) => {
          const trigNodeId = `trig-${art.id}-${tIdx}`;
          nList.push({
            id: trigNodeId,
            label: `⚡ ${trig}`,
            type: 'context_trigger',
            description: `Trigger condition activating this memory: "${trig}"`,
            sourceArtifact: art,
            radius: 11,
            color: '#be123c', // rose-700
          });

          lList.push({
            id: `link-trig-${art.id}-${tIdx}`,
            source: trigNodeId,
            target: artNodeId,
            relationType: 'triggered_by',
            label: 'Evokes Experience',
            strength: 0.6,
          });
        });
      }
    });

    return { nodes: nList, links: lList };
  }, [artifacts]);

  // Scenarios for interactive demonstration of the chain of thought
  const scenarios = [
    {
      id: 'friend-3am',
      title: 'Friend Calls in a 3 AM Panic',
      subtitle: 'How the AI avoids toxic positivity and sits on the floor with them',
      targetIds: ['node-core', 'art-node-art-1', 'trig-art-1-0', 'perspective-art-1'],
      description: 'When a friend calls overwhelmed in the quiet hours, the AI recalls the physical kitchen floor experience from "3:00 AM in the Valley". It bypasses generic cheerfulness and offers tactical, grounded empathy: "Don\'t solve your whole life right now; survive the next 10 minutes."',
    },
    {
      id: 'child-reassurance',
      title: 'Estranged Child Wonders if They Were Loved',
      subtitle: 'Unconditional devotion with complete absolution of guilt',
      targetIds: ['node-core', 'art-node-art-2', 'art-node-art-6', 'perspective-art-2', 'perspective-art-6'],
      description: 'When the estranged child reaches out, the AI links the sacred bedtime memories with the letter testament. It immediately relieves any burden of guilt and reiterates the core truth: "I loved you then, I love you now, and I will love you forever."',
    },
    {
      id: 'friend-burnout',
      title: 'Friend Retreating & Feeling Like a Burden',
      subtitle: 'Energy conservation and safe boundaries without performance',
      targetIds: ['node-core', 'art-node-art-3', 'perspective-art-3'],
      description: 'Drawing from "Why I Go Missing", the AI reframes silence not as indifference, but as survival conservation mode. It liberates the friend from having to perform cheerfulness.',
    },
    {
      id: 'kintsugi-brokenness',
      title: 'Facing Scars, Regret, & Life Fractures',
      subtitle: 'Turning trauma into structural empathy through Kintsugi',
      targetIds: ['node-core', 'art-node-art-4', 'perspective-art-4'],
      description: 'Connecting the Kintsugi artwork to the philosophy of suffering, the AI shows that repaired fractures are not shame—they are the exact gold through which we hold others without flinching.',
    },
  ];

  // Run D3 Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 550;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('class', 'main-graph-group');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom);

    // Filter nodes if needed
    const activeNodes = nodes.filter(n => {
      if (filterType === 'all') return true;
      if (filterType === 'traumas') return n.type === 'trauma' || n.type === 'core';
      if (filterType === 'joys') return n.type === 'joy' || n.type === 'core';
      if (filterType === 'perspectives') return n.type === 'perspective' || n.type === 'core';
      return true;
    });

    const activeNodeIds = new Set(activeNodes.map(n => n.id));
    const activeLinks = links.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as NodeData).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as NodeData).id : l.target;
      return activeNodeIds.has(sourceId) && activeNodeIds.has(targetId);
    });

    // Arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#a8a29e');

    // D3 Force Simulation
    const simulation = d3.forceSimulation<NodeData>(activeNodes)
      .force('link', d3.forceLink<NodeData, LinkData>(activeLinks)
        .id((d) => d.id)
        .distance((d) => (d.relationType === 'synthesized_to' ? 70 : 100))
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<NodeData>().radius((d) => d.radius + 18));

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup
      .selectAll<SVGLineElement, LinkData>('line')
      .data(activeLinks)
      .enter()
      .append('line')
      .attr('stroke', (d: LinkData) => {
        if (d.relationType === 'forged_by_trauma') return '#d97706';
        if (d.relationType === 'illuminated_by_joy') return '#f43f5e';
        if (d.relationType === 'synthesized_to') return '#0d9488';
        return '#cbd5e1';
      })
      .attr('stroke-width', (d: LinkData) => (d.relationType === 'synthesized_to' ? 2 : 1.5))
      .attr('stroke-opacity', 0.5)
      .attr('stroke-dasharray', (d: LinkData) => (d.relationType === 'triggered_by' ? '3,3' : 'none'));

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, NodeData>('g')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, NodeData>()
          .on('start', (event, d: NodeData) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: NodeData) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: NodeData) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (event, d: NodeData) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (d.sourceArtifact && onSelectArtifact) {
          // keep node selected for inspector
        }
      });

    // Node Circles
    nodeElements
      .append('circle')
      .attr('r', (d: NodeData) => d.radius)
      .attr('fill', (d: NodeData) => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all duration-300 shadow-sm')
      .attr('opacity', 0.92);

    // Core pulsing halo
    nodeElements
      .filter((d: NodeData) => d.type === 'core')
      .append('circle')
      .attr('r', (d: NodeData) => d.radius + 7)
      .attr('fill', 'none')
      .attr('stroke', '#78716c')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.6);

    // Node Labels
    nodeElements
      .append('text')
      .text((d: NodeData) => {
        if (d.type === 'core') return 'Ψ Core';
        return d.label.length > 20 ? d.label.slice(0, 18) + '…' : d.label;
      })
      .attr('dy', (d: NodeData) => d.radius + 13)
      .attr('text-anchor', 'middle')
      .attr('font-size', (d: NodeData) => (d.type === 'core' ? '11px' : '10px'))
      .attr('font-weight', (d: NodeData) => (d.type === 'core' ? '700' : '500'))
      .attr('fill', '#292524');

    // Simulation tick handler
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeElements.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Handle Scenario Highlight or Selection Highlight
    const currentHighlightTargets = activeScenario 
      ? scenarios.find(s => s.id === activeScenario)?.targetIds || []
      : selectedNode 
      ? [selectedNode.id] 
      : [];

    if (currentHighlightTargets.length > 0) {
      const targetSet = new Set(currentHighlightTargets);

      nodeElements.each(function (d: NodeData) {
        const isTarget = targetSet.has(d.id);
        d3.select(this)
          .select('circle')
          .transition()
          .duration(300)
          .attr('opacity', isTarget ? 1 : 0.25)
          .attr('stroke', isTarget ? '#f59e0b' : '#ffffff')
          .attr('stroke-width', isTarget ? 4 : 2);
      });

      linkElements.each(function (d: any) {
        const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
        const targetId = typeof d.target === 'object' ? d.target.id : d.target;
        const isConnected = targetSet.has(sourceId) && targetSet.has(targetId);
        d3.select(this)
          .transition()
          .duration(300)
          .attr('stroke-opacity', isConnected ? 1 : 0.1)
          .attr('stroke-width', isConnected ? 3.5 : 1);
      });
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filterType, activeScenario, selectedNode]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity
    );
  };

  const handleZoom = (delta: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy,
      delta > 0 ? 1.3 : 0.77
    );
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Thought Process Visualizer
              </h2>
              <p className="text-xs text-stone-500">
                Interactive D3 mapping of how raw artifacts, lowest lows, and joys forge outside-the-box perspective
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setFilterType('all'); setActiveScenario(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Nodes ({nodes.length})
          </button>
          <button
            type="button"
            onClick={() => { setFilterType('traumas'); setActiveScenario(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'traumas' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Traumas & Lows
          </button>
          <button
            type="button"
            onClick={() => { setFilterType('joys'); setActiveScenario(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'joys' ? 'bg-rose-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Joys & Bonds
          </button>
          <button
            type="button"
            onClick={() => { setFilterType('perspectives'); setActiveScenario(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'perspectives' ? 'bg-teal-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Outside-the-Box
          </button>
        </div>
      </div>

      {/* Scenario Simulations Bar */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Simulate Caller Scenarios (Trace AI Chain of Thought)
          </span>
          <span className="text-[11px] text-amber-800 hidden sm:inline">
            Click a scenario to watch the neural path through memories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {scenarios.map((sc) => {
            const isActive = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setActiveScenario(null);
                  } else {
                    setActiveScenario(sc.id);
                    setSelectedNode(null);
                  }
                }}
                className={`p-3 rounded-xl text-left border transition ${
                  isActive
                    ? 'bg-amber-900 text-white border-amber-950 shadow-md ring-2 ring-amber-500/40'
                    : 'bg-white hover:bg-amber-100/50 text-stone-800 border-amber-200 shadow-2xs'
                }`}
              >
                <div className="text-xs font-bold leading-tight line-clamp-1">
                  {sc.title}
                </div>
                <div className={`text-[11px] pt-1 line-clamp-2 ${isActive ? 'text-amber-200' : 'text-stone-500'}`}>
                  {sc.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {activeScenario && (
          <div className="p-3 bg-white/90 border border-amber-300 rounded-xl text-xs text-stone-800 space-y-1.5 animate-fadeIn">
            <div className="font-semibold text-amber-900 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Chain-of-Thought Deduction:
            </div>
            <p className="leading-relaxed">
              {scenarios.find(s => s.id === activeScenario)?.description}
            </p>
          </div>
        )}
      </div>

      {/* Main D3 Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          ref={containerRef}
          className="lg:col-span-2 relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs h-[550px] flex items-center justify-center"
        >
          <svg
            ref={svgRef}
            className="w-full h-full select-none"
          />

          {/* D3 Canvas Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-stone-200 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              id="btn-d3-zoom-in"
              onClick={() => handleZoom(1)}
              title="Zoom In"
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-d3-zoom-out"
              onClick={() => handleZoom(-1)}
              title="Zoom Out"
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-d3-reset-zoom"
              onClick={handleResetZoom}
              title="Reset View"
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="px-2 text-[10px] font-mono text-stone-400">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl p-2.5 shadow-xs text-[11px] text-stone-700 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span>Core Replica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
              <span>Traumas / Lows</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Joys / Bonds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Outside-The-Box</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-700" />
              <span>Triggers</span>
            </div>
          </div>
        </div>

        {/* Node Detail & Chain of Thought Inspector */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-[550px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: selectedNode.color }}>
                  {selectedNode.type.replace('_', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-stone-400 hover:text-stone-700 underline"
                >
                  Clear Selection
                </button>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {selectedNode.label}
                </h3>
                {selectedNode.mood && (
                  <div className="text-xs text-amber-800 font-medium pt-0.5">
                    Mood: {selectedNode.mood}
                  </div>
                )}
              </div>

              <div className="text-xs text-stone-600 leading-relaxed bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <div className="font-semibold text-stone-800 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Memory / Raw Context:
                </div>
                {selectedNode.description}
              </div>

              {selectedNode.outsideTheBox && (
                <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1">
                  <div className="font-semibold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Outside-the-Box Insight:
                  </div>
                  <p className="leading-relaxed">
                    {selectedNode.outsideTheBox}
                  </p>
                </div>
              )}

              {selectedNode.adviceForFriends && (
                <div className="text-xs text-teal-950 bg-teal-50/70 border border-teal-200 rounded-xl p-3 space-y-1">
                  <div className="font-semibold text-teal-900 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-teal-700" /> What this gives to Friends:
                  </div>
                  <p className="leading-relaxed">
                    {selectedNode.adviceForFriends}
                  </p>
                </div>
              )}

              {selectedNode.adviceForChildren && (
                <div className="text-xs text-rose-950 bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-1">
                  <div className="font-semibold text-rose-900 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-700" /> What this gives to Children:
                  </div>
                  <p className="leading-relaxed">
                    {selectedNode.adviceForChildren}
                  </p>
                </div>
              )}

              {selectedNode.sourceArtifact && (
                <button
                  type="button"
                  id="btn-view-artifact-from-d3"
                  onClick={() => onSelectArtifact && onSelectArtifact(selectedNode.sourceArtifact!)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-amber-50 text-xs font-medium text-stone-800 transition flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Artifact Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3 text-stone-500">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="font-serif font-bold text-stone-800 text-sm">
                  Click any Node or Scenario
                </h4>
                <p className="text-xs leading-relaxed">
                  Select an artifact, trauma anchor, or outside-the-box deduction to inspect the cognitive chain of thought behind its advice.
                </p>
              </div>

              {onNavigateToChat && (
                <button
                  type="button"
                  id="btn-d3-test-chat"
                  onClick={onNavigateToChat}
                  className="mt-4 px-4 py-2 bg-stone-900 text-stone-50 text-xs font-medium rounded-xl hover:bg-stone-800 transition"
                >
                  Test Perspective in Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
