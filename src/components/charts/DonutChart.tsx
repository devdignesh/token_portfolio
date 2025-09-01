import type { PortfolioDataItem } from "../../utils/chartUtils";

interface DonutChartProps {
  data: PortfolioDataItem[];
}

function DonutChart({ data }: DonutChartProps) {
  const radius = 80;
  const innerRadius = 42;
  const centerX = radius;
  const centerY = radius;

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length || totalValue === 0) {
    return (
      <div className="w-40 h-40 flex items-center justify-center">
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="0"
          />
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="#18181B" />
        </svg>
      </div>
    );
  }

  let cumulativeAngle = 0;

  return (
    <div>
      <svg width={160} height={170} viewBox="0 0 160 160">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth="0"
        />
        {data.map((item, index) => {
          const percentage = totalValue > 0 ? item.value / totalValue : 0;
          const angle = percentage * 360;

          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;

          const x1 =
            centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
          const y1 =
            centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
          const x2 =
            centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
          const y2 =
            centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);
          const x3 =
            centerX + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
          const y3 =
            centerY + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);
          const x4 =
            centerX +
            innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
          const y4 =
            centerY +
            innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            "Z",
          ].join(" ");

          cumulativeAngle += angle;

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#ffffff"
              strokeWidth="1"
            />
          );
        })}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0"
        />
      </svg>
    </div>
  );
}

export default DonutChart;
