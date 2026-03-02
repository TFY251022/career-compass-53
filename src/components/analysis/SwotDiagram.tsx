import { Shield, TrendingDown, Brain, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface SwotData {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

interface SwotDiagramProps {
  data: SwotData;
}

/**
 * SWOT Analysis diagram – central circle with 4 quadrant colors,
 * L-shaped connectors extending to outer description cards.
 * Layout: S(top-left) W(top-right) O(bottom-left) T(bottom-right)
 */
const SwotDiagram = ({ data }: SwotDiagramProps) => {
  const quadrants = [
    {
      key: "S",
      label: "Strengths",
      labelZh: "優勢",
      text: data.strengths,
      icon: TrendingDown, // will use TrendingUp-style icon rotated
      // Colors from the template image
      circleColor: "#3b9cba",   // teal-blue
      bgColor: "#3b9cba",
      borderColor: "#3b9cba",
      cardBg: "#f0fafb",
      position: "top-left" as const,
    },
    {
      key: "W",
      label: "Weaknesses",
      labelZh: "劣勢",
      text: data.weaknesses,
      icon: TrendingDown,
      circleColor: "#7b8b8e",   // grey
      bgColor: "#7b8b8e",
      borderColor: "#7b8b8e",
      cardBg: "#f5f6f6",
      position: "top-right" as const,
    },
    {
      key: "O",
      label: "Opportunities",
      labelZh: "機會",
      text: data.opportunities,
      icon: Brain,
      circleColor: "#3b9cba",   // teal
      bgColor: "#3b9cba",
      borderColor: "#3b9cba",
      cardBg: "#f0fafb",
      position: "bottom-left" as const,
    },
    {
      key: "T",
      label: "Threats",
      labelZh: "威脅",
      text: data.threats,
      icon: AlertTriangle,
      circleColor: "#7ea24e",   // olive green
      bgColor: "#7ea24e",
      borderColor: "#7ea24e",
      cardBg: "#f5f9f0",
      position: "bottom-right" as const,
    },
  ];

  // Icon overrides per quadrant
  const iconMap: Record<string, React.ReactNode> = {
    S: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    W: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path d="M3 7l6 6 4-4 8 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 17v-4h-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    O: <Brain className="h-5 w-5" />,
    T: <AlertTriangle className="h-5 w-5" />,
  };

  return (
    <div className="w-full">
      {/* ── Desktop: full diagram ── */}
      <div className="hidden md:block">
        <div className="relative mx-auto" style={{ maxWidth: 720, aspectRatio: "720/480" }}>
          {/* ─── Central Circle ─── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="relative rounded-full flex items-center justify-center"
              style={{ width: 140, height: 140 }}
            >
              {/* 4 quadrant backgrounds via conic gradient */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: `conic-gradient(
                    #3b9cba 0deg 90deg,
                    #7b8b8e 90deg 180deg,
                    #7ea24e 180deg 270deg,
                    #3b9cba 270deg 360deg
                  )`,
                }}
              />
              {/* Inner white circle */}
              <div className="relative z-10 h-16 w-16 rounded-full bg-white flex flex-col items-center justify-center shadow-md">
                <span className="text-xs font-bold text-foreground tracking-wide leading-none">SWOT</span>
                <span className="text-[9px] text-muted-foreground tracking-widest uppercase">Analysis</span>
              </div>
              {/* Quadrant letters */}
              <span className="absolute text-white font-bold text-xl select-none" style={{ top: 18, left: 24 }}>S</span>
              <span className="absolute text-white font-bold text-xl select-none" style={{ top: 18, right: 24 }}>W</span>
              <span className="absolute text-white font-bold text-xl select-none" style={{ bottom: 18, left: 24 }}>O</span>
              <span className="absolute text-white font-bold text-xl select-none" style={{ bottom: 18, right: 24 }}>T</span>
            </div>
          </div>

          {/* ─── SVG L-shaped connectors ─── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 720 480" fill="none">
            {/* S connector: from center-left-top to top-left card */}
            <path d="M 310 200 L 210 200 L 210 70 L 280 70" stroke="#3b9cba" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* W connector: from center-right-top to top-right card */}
            <path d="M 410 200 L 510 200 L 510 70 L 440 70" stroke="#7b8b8e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* O connector: from center-left-bottom to bottom-left card */}
            <path d="M 310 280 L 210 280 L 210 410 L 280 410" stroke="#3b9cba" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* T connector: from center-right-bottom to bottom-right card */}
            <path d="M 410 280 L 510 280 L 510 410 L 440 410" stroke="#7ea24e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>

          {/* ─── Outer Cards ─── */}
          {/* Top-Left: Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute rounded-xl border-2 p-4"
            style={{ top: 10, left: 0, width: 280, borderColor: "#3b9cba", backgroundColor: "#f8fcfd" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f3f7", color: "#3b9cba" }}>
                {iconMap.S}
              </div>
              <span className="font-bold text-foreground text-sm">Strengths</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#675143" }}>{data.strengths}</p>
          </motion.div>

          {/* Top-Right: Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute rounded-xl border-2 p-4"
            style={{ top: 10, right: 0, width: 280, borderColor: "#7b8b8e", backgroundColor: "#f7f8f8" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8eaeb", color: "#7b8b8e" }}>
                {iconMap.W}
              </div>
              <span className="font-bold text-foreground text-sm">Weaknesses</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#675143" }}>{data.weaknesses}</p>
          </motion.div>

          {/* Bottom-Left: Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute rounded-xl border-2 p-4"
            style={{ bottom: 10, left: 0, width: 280, borderColor: "#3b9cba", backgroundColor: "#f8fcfd" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f3f7", color: "#3b9cba" }}>
                {iconMap.O}
              </div>
              <span className="font-bold text-foreground text-sm">Opportunities</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#675143" }}>{data.opportunities}</p>
          </motion.div>

          {/* Bottom-Right: Threats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute rounded-xl border-2 p-4"
            style={{ bottom: 10, right: 0, width: 280, borderColor: "#7ea24e", backgroundColor: "#f7faf2" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8f0dc", color: "#7ea24e" }}>
                {iconMap.T}
              </div>
              <span className="font-bold text-foreground text-sm">Threats</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#675143" }}>{data.threats}</p>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: stacked cards ── */}
      <div className="md:hidden space-y-4">
        {/* Small center badge */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-md"
            style={{
              background: `conic-gradient(#3b9cba 0deg 90deg, #7b8b8e 90deg 180deg, #7ea24e 180deg 270deg, #3b9cba 270deg 360deg)`,
            }}
          >
            <div className="h-10 w-10 rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-[8px] font-bold text-foreground">SWOT</span>
            </div>
          </div>
        </div>

        {[
          { key: "S", label: "Strengths", text: data.strengths, border: "#3b9cba", bg: "#f8fcfd", iconBg: "#e0f3f7", iconColor: "#3b9cba" },
          { key: "W", label: "Weaknesses", text: data.weaknesses, border: "#7b8b8e", bg: "#f7f8f8", iconBg: "#e8eaeb", iconColor: "#7b8b8e" },
          { key: "O", label: "Opportunities", text: data.opportunities, border: "#3b9cba", bg: "#f8fcfd", iconBg: "#e0f3f7", iconColor: "#3b9cba" },
          { key: "T", label: "Threats", text: data.threats, border: "#7ea24e", bg: "#f7faf2", iconBg: "#e8f0dc", iconColor: "#7ea24e" },
        ].map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 p-4"
            style={{ borderColor: item.border, backgroundColor: item.bg }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                {iconMap[item.key]}
              </div>
              <span className="font-bold text-foreground text-sm">{item.label}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#675143" }}>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SwotDiagram;
