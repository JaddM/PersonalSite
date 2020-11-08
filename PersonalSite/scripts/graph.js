// To visually display dots attributes in the 'LivingDots' page

google.charts.load('current', {'packages':['corechart']});

function drawChart(stats, label, graphID) {
    var data = google.visualization.arrayToDataTable(stats);

    var options = {title: label};
    var chart = new google.visualization.LineChart(document.getElementById(graphID));
    chart.draw(data, options);
}