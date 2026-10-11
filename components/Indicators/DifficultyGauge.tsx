import { Colors } from "@/constants/theme";
import { DIFFICULTY_MAX } from "@/domain/climb";
import Svg, { Circle, Line, Path } from "react-native-svg";

// Drawn on a 24×15 grid and scaled to `width`
const CX = 12;
const CY = 12;
const R = 9;
/** Space between two levels, as a fraction of the dial. */
const GAP = 0.025;

/** Point on the dial: 0 is the far left (easy), 1 the far right (hard). */
const dialPoint = (t: number, radius = R) => {
  const angle = Math.PI * (1 - t);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
};

const arc = (from: number, to: number) => {
  const a = dialPoint(from);
  const b = dialPoint(to);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
};

/**
 * Perceived difficulty as a speedometer: one colored slice per level, lit up
 * to the value, with the needle on the current level.
 */
const DifficultyGauge = ({
  value,
  width = 26,
}: {
  value: number;
  width?: number;
}) => {
  const max = DIFFICULTY_MAX;
  const tip = dialPoint((value - 0.5) / max, R - 3);

  return (
    <Svg width={width} height={(width * 15) / 24} viewBox="0 0 24 15">
      {Colors.difficulty.map((color, i) => (
        <Path
          key={i}
          d={arc(i / max + GAP, (i + 1) / max - GAP)}
          stroke={color}
          strokeOpacity={i < value ? 1 : 0.2}
          strokeWidth={3}
          fill="none"
        />
      ))}
      <Line
        x1={CX}
        y1={CY}
        x2={tip.x}
        y2={tip.y}
        stroke={Colors.text}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={CX} cy={CY} r={1.75} fill={Colors.text} />
    </Svg>
  );
};

export default DifficultyGauge;
