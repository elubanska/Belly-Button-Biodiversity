//import json sample data

function dropdown(){
d3.json("samples.json").then((data)=> {
    //console.log(data)
    var name = data.names;
    var dataid = d3.select("#selDataset");
    name.forEach((sample) => {
        dataid.append("option")
        .text(sample)
        .property("value",sample);
    });
    var samplevalue = name[0];
    metadata(samplevalue);
    createChart(samplevalue);
});
}

dropdown()

function metadata(datasample){
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        var metadata = data.metadata;
        console.log(metadata);
        console.log(datasample);
        var dataarray = metadata.filter(sampleobject => sampleobject.id == datasample);
        var result = dataarray[0];
        var display = d3.select("#sample-metadata");
        display.html("")
        Object.entries(result).forEach(([key,value])=> {
            display.append("h6").text(`${key} ${value}`);
        })
    })
}

function optionChanged(newsample){
    metadata(newsample);
    createChart(newsample)
}

function createChart(sampleid){
    d3.json("samples.json").then((data)=> {
        //Sample data read
        var sampledata = data.samples;
        var dataarray = sampledata.filter(sampleobject => sampleobject.id == sampleid);
        var result = dataarray[0];
        var otuid = result.otu_ids;
        var lables = result.otu_lables;
        var samples = result.sample_values;
        
        //Metadata read
        var metadata = data.metadata;
        var mdarray = metadata.filter(samplemd => samplemd.id == sampleid);
        var mdresult = mdarray[0];
        var wfreq = mdresult.wfreq;
        //console.log(wfreq);

        //Create Bubble chart
        var bubbledata = [{
            x: otuid,
            y: samples,
            text: lables,
            mode: "markers",
            marker: {
                size: samples,
                color: otuid,
                colorscale: "Blues"
            }
        }];
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: {title: 'OTU ID'},
            hovermode: "closest"
          };
        //Plot Bubble chart
        Plotly.newPlot("bubble", bubbledata, bubbleLayout);

        //Create Bar chart
        var ylabel = otuid.slice(0,10).reverse().map(otuid => "OTU " + otuid);
        var bardata = [{
            type: 'bar',
            x: samples.slice(0,10).reverse(),
            y: ylabel,
            orientation: 'h',
            hovertext: lables
        }];
        var barLayout = {
            title: 'Top 10 microbial species found',
            xaxis: {title: 'SAMPLE'}
        };
        //Plot Bar chart
        Plotly.newPlot("bar", bardata, barLayout)

        var gaugeData = [{
                
                value: wfreq,
                title: { text: "Belly Button Washing Frequency"},
                
                subtitle: { text: "Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9], borderwidth: 0, visible: false },
                    
            
                    bar: { color: "darkblue" },
                    //bgcolor: "white",
                    //borderwidth: 2,
                    //bordercolor: "gray",
                    
                    steps: [
                      { range: [0, 1], color: "#E1F5FE" },
                      { range: [1, 2], color: "#B3E5FC" },
                      { range: [2, 3], color: "#81d4fa" },
                      { range: [3, 4], color: "#4fc3f7" },
                      { range: [4, 5], color: "#29b6f6" },
                      { range: [5, 6], color: "#03a9f4" },
                      { range: [6, 7], color: "#039be5" },
                      { range: [7, 8], color: "#0277bd" },
                      { range: [8, 9], color: "#01579b" }
                    ]
                }
            }
          ];
          
          var gaugeLayout = {
            width: 600,
            height: 500,
            //margin: { t: 0, b: 0 },
            //paper_bgcolor: "lavender",
            //font: { color: "darkblue", family: "Arial" }
            
          };
          
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);


    });
}