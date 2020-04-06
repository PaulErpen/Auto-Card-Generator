require.config({
  paths: {
      'html2canvas': 'html2canvas.min',
      'jquery': 'jquery.min'
  }
});

require(['html2canvas', 'jquery'], function(html2canvas, $) {
  $("#process").on("click", processData);
  $("#print").on("click", printCards);

  function processData(event) {
    var files = $("#data").get(0).files;
    if(files.length > 0) {
      sendExcelData(files[0])
    }
  }

  function sendExcelData(file) {
    var fd = new FormData();
    fd.append('file', file);
    $.ajax({
      url: "http://localhost:3000/excel",
      type: 'post',
      data: fd,
      contentType: false,
      processData: false,
      success: handleResponse
    });
  }

  function handleResponse(data) {
    $("#preview").html(data);
    var effect_fields = $(".card .effect");
    var max_height = 0;
    for(k in effect_fields) {
      if(effect_fields[k].offsetHeight > max_height) {
        max_height = effect_fields[k].offsetHeight
      }
    }
    $(".card .effect").css("bottom", max_height / 2 + "px");
  }

  function printCards(event) {
    var cards = $(".card");
    for(k in cards) {
      html2canvas(cards[k]).then(function(canvas) {
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.href = url;
        link.download = 'Download.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      return;
    }
  }
});