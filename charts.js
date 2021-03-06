function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // First, check the data variable
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var allSamps = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSamp = allSamps.filter(s => s.id == sample);
    
    // Check resultSamp
    console.log(resultSamp);

    //  5. Create a variable that holds the first sample in the array.
    var firstSamp = resultSamp[0];

    // Check firstSamp
    console.log(firstSamp);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = firstSamp.otu_ids;
    let otu_labels = firstSamp.otu_labels;
    let sample_values = firstSamp.sample_values;

    // Check new variables
    console.log(firstSamp);
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedOtu = firstSamp.otu_ids.sort((a,b) => a.sample_values - b.sample_values);
    console.log(sortedOtu);
    

    var yticks = otu_ids.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    console.log(yticks);



    // 8. Create the trace for the bar chart. 
    var barData = {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      type: "bar",
      orientation: 'h',
      text: firstSamp.otu_labels.slice(0,10).reverse()
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values}}

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID"},
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    let wfreq = parseFloat(result.wfreq);
    console.log(wfreq);

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency<br><i>Washes per Week</i>" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: "black" },
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 350
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
