
margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 50
};
width = 620, height = 500;
var x = d3.scaleBand().range([0, width - margin.right]),
    y = d3.scaleLinear().range([height, 0]),
    color = d3.scaleOrdinal(d3.schemeCategory10);
var anioIni = 2010;
var anioFin = 2012, intervalo = 0
//variables para cargar
let valoresMaxMin;
const _urlData = "data/datos.json";
const BAR_WIDTH = 24;
const BAR_GAP = 2;
var svg, bar, xAxis, xlabel;
const duracion = 750;

d3.json(_urlData).then(datos => {
    init(datos);
    //defino el espacio de trabajo
    svg = d3
        .select(".grafico")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")

    xlabel = svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")


    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Millones, $");

    bar = g.append("g")
    //Actualiza la info
    d3.interval(() => {
        if (intervalo == 0) {
            intervalo = anioIni;
        }
        else if (intervalo == anioFin) {
            intervalo = anioIni;
        }
        else {
            ++intervalo;
        }
        let filtro = datos.filter(d => { return d.anio == intervalo });
        update(filtro);

    }, 5000);
    /* let filtro = datos.filter(d => { return d.anio == 2010 });
     update(filtro);*/

})

var init = (datos) => {
    valoresMax = d3.max(datos, d => d.valor);
    y.domain([0, valoresMax]);
    x.padding(0.1);
}

var update = (datos) => {

    datos = datos.sort(function (a, b) {
        return d3.descending(a.valor, b.valor)
    });
    x.domain(datos.map(d => d.pais));
    xAxis.call(d3.axisBottom(x));
    xlabel.text("Año: " + datos[0].anio);

 

    bar.selectAll(".dot1")

        .attr("class", "rectangulo")
        .data(datos)
        .enter()
        .append("rect")

    bar.exit()
        .transition()
        .duration(300)
        .ease(d3.easeExp)
        .attr("height", 0)
        .remove();
    bar.transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .attr("x", (d) => { return x(d.pais); })
        .attr("y", (d) => y(d.valor))
        .attr("width", 40)
        .attr("height", (d) => {
            return height - y(d.valor);
        })
        .attr("fill", (d) => color(d.region));
}