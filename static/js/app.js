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
    metadata(samplevalue)
    createChart(samplevalue)
});
}

dropdown()

function metadata(datasample){
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        var metadata = data.metadata;
      /*  console.log(metadata);
        console.log(datasample);*/
        var dataarray = metadata.filter(sampleobject => sampleobject.id == datasample);
        var result = dataarray[0];
        var desplay = d3.select("#sample-metadata");
        desplay.html("")
        Object.entries(result).forEach(([key,value])=> {
            desplay.append("h6").text(`${key} ${value}`);
        })
    })
}

function optionChanged(newsample){
    metadata(newsample);
    createChart(newsample)
}

function createChart(sampleid){
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        var sampledata = data.samples;
        var dataarray = sampledata.filter(sampleobject => sampleobject.id == sampleid);
        var result = dataarray[0];
        console.log(result)
        var outid = result.otu_ids;
        var lables = result.otu_lables;
        var samples = result.sample_values;

        var bubbledata = [{
            x: outid,
            y: samples,
            text: lables,
            mode: "markers",
            marker: {
                size: samples,
                color: outid,
                colorscale: "Earth"
            }
        }];
        Plotly.newPlot("bubble", bubbledata);
});
}