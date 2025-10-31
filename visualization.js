// GeoJSON Map Visualization for Looker Studio
const dscc = window.dscc;

const drawViz = (data) => {
  const container = document.getElementById("geojsonMap");
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container);
  svg.selectAll("*").remove();

  const g = svg.append("g");

  // Example: Use a built-in sample GeoJSON or bind from Looker data
  // (In production, you can map Looker fields to coordinates or geojson URLs.)
  const sampleGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Example Region" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[77, 28], [78, 28], [78, 29], [77, 29], [77, 28]]]
        }
      }
    ]
  };

  const projection = d3.geoMercator()
    .fitSize([width, height], sampleGeoJSON);

  const path = d3.geoPath().projection(projection);

  g.selectAll("path")
    .data(sampleGeoJSON.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#80b1d3")
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  g.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Sample GeoJSON Map")
    .style("font-size", "14px");
};

// When running in Looker Studio
if (dscc) {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
} else {
  // Local debug mode
  drawViz({});
}
