// GeoJSON Map Visualization for Looker Studio
const dscc = window.dscc || null;

const drawViz = (data) => {
  const container = document.getElementById("geojsonMap");
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container);
  svg.selectAll("*").remove();

  const g = svg.append("g");

  // Sample GeoJSON (replace with your data later)
  const sampleGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      { "type": "Feature", "properties": { "AFFGEOID": "1400000US26023951400", "ALAND": 6120213, "AWATER": 89019, "BRACKET": "HISPANIC OR LATINO_0PC - 49.99PC", "CBSA_NAME": "NON_METRO_AREA", "CENSUS_TRA": "26023951400", "COUNTY_NAM": "BRANCH COUNTY, MI", "DISPF": "HISPANIC OR LATINO", "DISPN": "DERIVED_ETHNICITY", "GEOID": "26023951400", "GEOIDFQ": null, "LABEL": null, "layer": "APP_RISK_2020_DERIVED_ETHNICITY", "LSAD": "CT", "NAME": "9514", "NAMELSAD": "Census Tract 9514", "NAMELSADCO": "Branch County", "path": null, "STATE_NAME": "MICHIGAN", "STUSPS": "MI", "TRACTCE": "951400", "YEAR": "2020" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -85.002728, 41.934374 ], [ -85.001944, 41.936576 ], [ -85.000747, 41.94063 ], [ -85.000434, 41.941665 ], [ -85.000401, 41.943213 ], [ -84.998331, 41.942894 ], [ -84.995542, 41.942435 ], [ -84.995641, 41.956252 ], [ -84.994723, 41.956245 ], [ -84.993153, 41.956254 ], [ -84.985889, 41.956248 ], [ -84.980917, 41.956219 ], [ -84.973686, 41.956209 ], [ -84.973509, 41.945574 ], [ -84.973511, 41.945209 ], [ -84.973465, 41.942157 ], [ -84.97346, 41.941818 ], [ -84.973351, 41.936191 ], [ -84.973294, 41.933102 ], [ -84.973282, 41.932603 ], [ -84.973156, 41.924872 ], [ -84.973255, 41.924223 ], [ -84.977419, 41.924429 ], [ -84.980846, 41.927736 ], [ -84.980597, 41.928613 ], [ -84.986371, 41.932138 ], [ -84.990665, 41.933064 ], [ -84.994, 41.931367 ], [ -85.000039, 41.93004 ], [ -85.004752, 41.932342 ], [ -85.002728, 41.934374 ] ] ] ] } }
    ]
  };

  const projection = d3.geoMercator().fitSize([width, height], sampleGeoJSON);
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
  console.log("Running in local debug mode...");
  drawViz({});
}

// Handle resize in Looker Studio
window.addEventListener("resize", () => drawViz({}));
