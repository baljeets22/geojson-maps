// GeoJSON Map Visualization for Looker Studio
const dscc = window.dscc || null;

const GEOJSON_URL =
  "https://raw.githubusercontent.com/baljeets22/geojson-maps/main/MINIGEO.geojson";

const drawViz = async (data) => {
  const container = document.getElementById("geojsonMap");
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container);
  svg.selectAll("*").remove();
  const g = svg.append("g");

  // Load your GeoJSON from GitHub
  let geojsonData;
  try {
    const response = await fetch(GEOJSON_URL);
    geojsonData = await response.json();
  } catch (err) {
    console.error("Error loading GeoJSON:", err);
    g.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("Failed to load GeoJSON data")
      .style("font-size", "14px")
      .attr("fill", "red");
    return;
  }

  // Create projection and path
  const projection = d3.geoMercator().fitSize([width, height], geojsonData);
  const path = d3.geoPath().projection(projection);

  // Draw polygons
  g.selectAll("path")
    .data(geojsonData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#4e79a7")
    .attr("stroke", "#222")
    .attr("stroke-width", 0.4)
    .append("title")
    .text((d) => d.properties?.NAME || "Region");

  // Add title text
  g.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("GeoJSON Map View")
    .style("font-size", "14px");
};

// Subscribe in Looker Studio
if (dscc) {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
} else {
  console.log("Running in local debug mode…");
  drawViz({});
}

// Redraw on resize
window.addEventListener("resize", () => drawViz({}));
