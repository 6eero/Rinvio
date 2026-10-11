import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { Climb } from "@/domain/climb";
import { getYearActivity } from "@/domain/stats";
import { SmartSquare } from "./SmartSquare";

const opacityFor = (count: number) => {
  if (count === 0) return 0.05;
  if (count <= 5) return 0.25;
  return 0.7;
};

/** One square per day of the current year, brighter on busier days. */
export default function ActivityCalendar({ climbs }: { climbs: Climb[] }) {
  return (
    <Card style={{ padding: 14, flexDirection: "row", flexWrap: "wrap" }}>
      {getYearActivity(climbs).map(({ date, count }) => (
        <SmartSquare
          key={date}
          color={Colors.activity}
          opacity={opacityFor(count)}
        />
      ))}
    </Card>
  );
}
