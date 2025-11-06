
const dscc = window.dscc || null;


const GEOJSON_URL =
  "https://raw.githubusercontent.com/baljeets22/geojson-maps/main/MINIGEO.geojson";


const COLOR_PROPERTY = "DISPN";
const TOOLTIP_PROPERTY = "GEOID";

async function drawViz(data) {
  const container = document.getElementById("geojsonMap");
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container);
  svg.selectAll("*").remove();
  const g = svg.append("g");

  
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

  // Define projection and path
  const projection = d3.geoMercator().fitSize([width, height], geojsonData);
  const path = d3.geoPath().projection(projection);

  // Extract unique property values for color scale
  const values = Array.from(
    new Set(geojsonData.features.map(f => f.properties?.[COLOR_PROPERTY]))
  ).filter(Boolean);

  // Create color scale
  const color = d3.scaleOrdinal()
    .domain(values)
    .range(["#0084ffff", "#aaff00ff", "#ff0040ff"]); // more colors

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "geo-tooltip")
    .style("position", "absolute")
    .style("padding", "6px 10px")
    .style("background", "rgba(0,0,0,0.7)")
    .style("color", "#fff")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("visibility", "hidden");

  // Draw polygons
  g.selectAll("path")
    .data(geojsonData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => color(d.properties?.[COLOR_PROPERTY]))
    .attr("stroke", "#333")
    .attr("stroke-width", 0.4)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#ffcc00");
      tooltip.style("visibility", "visible").html(`
        <b>${d.properties?.BRACKET || "Region"}</b><br>
        ${TOOLTIP_PROPERTY}: ${d.properties?.[TOOLTIP_PROPERTY] || "N/A"}<br>
        STATE_NAME: ${d.properties?.['STATE_NAME'] || "N/A"}
      `);
    })
    .on("mousemove", function (event) {
      tooltip.style("top", `${event.pageY - 40}px`).style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("fill", color(d.properties?.[COLOR_PROPERTY]));
      tooltip.style("visibility", "hidden");
    });

  // Add title
  g.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .attr("fill", "#222");
}

// Run visualization
if (dscc) {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
} else {
  console.log("Running locally...");
  drawViz({});
}

window.addEventListener("resize", () => drawViz({}));
