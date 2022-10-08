import React, { useEffect } from "react";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import Load500By500 from "./lineChart1";

async function initSciChart() {
  // LICENSING //
  // Set your license code here
  SciChartSurface.setRuntimeLicenseKey(
    "k0FVPKzCbA8cJkUBgH/o7WBq2pIsCifHWXQhT5z9ecC+3Ti4iJDHfm9W6PohsDynYRqZ+W+eN+A9Vi3TxQ2nvjrwh32X17cfxmIWgIYqF2pT5hsEru/Ir4fVowv6Tk1hp9UNbSMNKTWQxPm+oLnbLiu64yV5hpXWbABbLdCgFzuLi1yi4NntnLeDbRlocpfCkKwZFwHLo6roKx1yikC7ydx3nk6Twigbz6fAZWZBZkBJTmjCPkCSqTeo+J77esKu1bjrZJk1UQ4O6fBpN6IE3thXz2QTeg5ZRCN10tf8ufkJDs7XmVSZhjKMA1Qvfk+aKrkkBAR+CAx7keR8jiII3TiUORDAwpqRYHtUvT0i34qLkT1X4L27h8Zgxt65XBLtgfDOLmHlYXplU0W7bjCHXPNw4eeawg01Yft7E8jjnY/43ZfHhDwOMJEaNs6dSavV67i1qSSlH1gGrArDvAnePZCZdaI7moEX43sCllVfP5ufg3Qn5BYyjwRWGqTh8zKHa2xKsjOMjdb0HBMzTvTb/9iuqGSSz5HLRiUXvnsC6inKRVpNahB1VqoTRw=="
  );
  // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  //
  // e.g.
  //
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
  //
  // Also, once activated (trial or paid license) having the licensing wizard open on your machine
  // will mean any or all applications you run locally will be fully licensed.

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // That's it! You just created your first SciChartSurface!
}

function App() {
  //   useEffect(() => {
  //     console.log("use effect");
  //     initSciChart();
  //   });

  return (
    <div className="App">
      <header className="App-header">
        <h1>SciChart.js with React hello world!</h1>
        <p>
          In this examplle we setup webpack, scichart, react and create a simple
          chart with one X and Y axis
        </p>
      </header>
      <div id="scichart-root" style={{ maxWidth: 900 }} />
      {/* <LineChart /> */}
      <Load500By500 />
    </div>
  );
}

export default App;
