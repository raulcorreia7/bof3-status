import { CanvasRenderer } from "echarts/renderers";
import { echarts } from "./register.ts";

echarts.use([CanvasRenderer]);

export { echarts };
