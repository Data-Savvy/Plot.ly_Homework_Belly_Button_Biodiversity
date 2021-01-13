//Changing Sample Id from user input in dropdown box


function Panel(id) {
    d3.json("./samples.json").then((data)=>{
        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];

    var info = d3.select("#sample-metadata");    

    info.html("");

    Object.entries(result).forEach((key) =>{
        info.append("h5").text(key[0].toLowerCase() + ":" + key[1] + "\n");});
    });
};

function chart(id){
    d3.json("./samples.json").then((data)=>{
        //Bar Chart with top 10 OTU of samples

        //Filitering throught the sample data to match the id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        //Top ten samples ranging from highest to least
        
        //X-axis label
        var OTU_top = (samples.sample_values.slice(0,10)).reverse();
        //Y-axis lables for top ten OTUs
        var OTU_id = OTU_top.map(o => "OTU"+" "+ o);
        //Hovertext labels
        var labels = (samples.otu_labels.slice(0, 10));

        var trace1 = {
            x: OTU_top,
            y: OTU_id,
            text: labels,
            marker: 
            {
            color: "green"},
            type:"bar",
            orientation: "h",
        };
        var data = [trace1];

        // Layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU Samples",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 150,
                r: 150,
                t: 90,
                b: 20
                }
            
            
            };
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
       var trace2 = [
            {
            title: 'Overview of All Samples',
            x: OTU_id,
            y: samples.otu_ids,
            mode: "markers",
            text: labels,
            marker: 
                {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: "Viridis"
                }
            }
            ];
            var bubbleLayout = {
                margin: {t: 0},
                hovermode: "closest",
                xaxis: {title: "OTU ID"}
                };
        Plotly.newPlot("bubble", trace2, bubbleLayout);

    });
}

function optionChanged(id){
    Panel(id);
    chart(id);
}

//Initialization funcation to insert dropdown options and plot data and demographic info
function initial() {
    // Selecting tag in index.html for dropdown menu
    var dropdown = d3.select("#selDataset");
    // Reading data from samples.json
    d3.json("./samples.json").then((data) => {
        console.log(data);
        //
        data.names.forEach((name) => {
                dropdown.append("option").text(name).property("value");
            });

        //Callback functions for plots and demographic inital sample
        Panel(data.names[0]);
        chart(data.names[0])
    });
};
//Webpage rest to an inital value in dataset
initial();