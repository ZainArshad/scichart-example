import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { convertRgbToHexColor } from "scichart/utils/convertColor";
import data from "./csvjson.json";

const divElementId = "chart";

const SERIES = 10000;

const drawExample = async (updateTimeSpans) => {
  SciChartSurface.setRuntimeLicenseKey(
    "k0FVPKzCbA8cJkUBgH/o7WBq2pIsCifHWXQhT5z9ecC+3Ti4iJDHfm9W6PohsDynYRqZ+W+eN+A9Vi3TxQ2nvjrwh32X17cfxmIWgIYqF2pT5hsEru/Ir4fVowv6Tk1hp9UNbSMNKTWQxPm+oLnbLiu64yV5hpXWbABbLdCgFzuLi1yi4NntnLeDbRlocpfCkKwZFwHLo6roKx1yikC7ydx3nk6Twigbz6fAZWZBZkBJTmjCPkCSqTeo+J77esKu1bjrZJk1UQ4O6fBpN6IE3thXz2QTeg5ZRCN10tf8ufkJDs7XmVSZhjKMA1Qvfk+aKrkkBAR+CAx7keR8jiII3TiUORDAwpqRYHtUvT0i34qLkT1X4L27h8Zgxt65XBLtgfDOLmHlYXplU0W7bjCHXPNw4eeawg01Yft7E8jjnY/43ZfHhDwOMJEaNs6dSavV67i1qSSlH1gGrArDvAnePZCZdaI7moEX43sCllVfP5ufg3Qn5BYyjwRWGqTh8zKHa2xKsjOMjdb0HBMzTvTb/9iuqGSSz5HLRiUXvnsC6inKRVpNahB1VqoTRw=="
  );

  let xvalues = [],
    yvalues = [],
    tempx = [],
    tempy = [];

  let keys = Object.keys(data[0]);

  keys.forEach((k) => {
    data.forEach((d) => {
      if (k.localeCompare("Frequency") != 0) {
        tempx.push(d["Frequency"]);
        tempy.push(d[k]);
      }
    });
    xvalues.push(tempx);
    yvalues.push(tempy);
    tempx = [];
    tempy = [];
  });

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    { widthAspect: 3, heightAspect: 2 }
  );
  const xAxis = new NumericAxis(wasmContext, {
    visibleRange: new NumberRange(-2500, 50000),
    autoRange: EAutoRange.Never,
  });

  sciChartSurface.xAxes.add(xAxis);
  const yAxis = new NumericAxis(wasmContext, {
    visibleRange: new NumberRange(-50000, 50000),
    autoRange: EAutoRange.Never,
  });
  sciChartSurface.yAxes.add(yAxis);

  const dataSeriesArray = new Array(SERIES);
  const rendSeriesArray = new Array(SERIES);

  for (let i = 0; i < SERIES; i++) {
    const dataSeries = new XyDataSeries(wasmContext);
    const rendSeries = new FastLineRenderableSeries(wasmContext, {
      dataSeries,
      strokeThickness: 2,
    });

    dataSeriesArray[i] = dataSeries;
    rendSeriesArray[i] = rendSeries;

    sciChartSurface.renderableSeries.add(rendSeries);
  }

  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(),
    new ZoomPanModifier(),
    new MouseWheelZoomModifier()
  );

  const loadPoints = () => {
    const newTimeSpans = [];

    // Start counting Points generation time
    const generateTimestamp = Date.now();

    const strokeArray = new Array(SERIES);
    for (let i = 0; i < SERIES; i++) {
      // Clear data, if any
      dataSeriesArray[i].clear();

      // Generate stroke
      const r = Math.random();
      const g = Math.random();
      const b = Math.random();
      strokeArray[i] = convertRgbToHexColor(r, g, b);
    }

    // Add the first time span: Generating 1M data points
    newTimeSpans.push({
      title: "Generate 500x500 Data Points",
      durationMs: Date.now() - generateTimestamp,
    });

    // Start counting batch append time
    const appendTimestamp = Date.now();

    for (let i = 0; i < SERIES; i++) {
      dataSeriesArray[i].appendRange(xvalues[i], yvalues[i]);
      rendSeriesArray[i].stroke = strokeArray[i];
    }

    // Add the second time span: Generation of data point
    newTimeSpans.push({
      title: "Append 500x500 Data Points",
      durationMs: Date.now() - appendTimestamp,
    });

    // Subscribe to sciChartSurface.rendered event,
    // and calculate time duration between the append and
    // the first frame after it
    const firstFrameTimestamp = Date.now();
    let frameIndex = 0;
    let nextFramesTimestamp;
    const handler = () => {
      if (frameIndex === 0) {
        // Add the third time span: Render the first frame
        newTimeSpans.push({
          title: "Render the frame",
          durationMs: Date.now() - firstFrameTimestamp,
        });
        nextFramesTimestamp = Date.now();
      } else {
        // Unsubscribe from sciChartSurface.rendered
        updateTimeSpans(newTimeSpans);
        sciChartSurface.rendered.unsubscribe(handler);

        // Zoom extents at the end of performance measurement
        sciChartSurface.zoomExtents();
      }
      setTimeout(sciChartSurface.invalidateElement, 0);
      // Increment frame index
      frameIndex++;
    };
    sciChartSurface.rendered.subscribe(handler);
  };

  return { wasmContext, sciChartSurface, loadPoints };
};

let scs;
let autoStartTimerId;

export default function Load500By500() {
  const [timeSpans, setTimeSpans] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      //setLoading(true);
      const res = await drawExample((newTimeSpans) => {
        setTimeSpans([...newTimeSpans]);
      });
      scs = res.sciChartSurface;
      autoStartTimerId = setTimeout(res.loadPoints, 0);
      if (res) setLoading(false);
    })();
    // Delete sciChartSurface on unmount component to prevent memory leak
    return () => {
      clearTimeout(autoStartTimerId);
      scs?.delete();
    };
  }, []);

  return (
    <>
      <div>
        <div id={divElementId} />
      </div>
    </>
  );
}
