import { TreemapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";

echarts.use([TreemapChart, TooltipComponent]);

export { echarts };
export type { EChartsCoreOption as ChartOption } from "echarts/core";
