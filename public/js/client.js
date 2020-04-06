require.config({
  paths: {
      'html2canvas': 'html2canvas.min',
      'jquery': 'jquery.min',
      'xslx': 'xlsx'
  }
});

require(['html2canvas', 'jquery', 'xlsx'], function(html2canvas, $) {
  $("#process").on("click", processData);
  debugger;

  function processData(event) {
    var files = $("#data").get(0).files;
    if(files.length > 0) {
      var fr = new FileReader();
      debugger;
      fr.onload = function(f) {
        var binary =  f.target.result;
      }
      fr.readAsBinaryString(files[0]);
    }
  }
});