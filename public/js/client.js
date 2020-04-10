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
    var inner_cards = $(".card .card-inner");
    var max_height = 0;
    var card_height = inner_cards[0].offsetHeight;
    for(k = 0; k < inner_cards.length; k++) {
        var offset_height = 60;
        offset_height += $(inner_cards[k]).find(".title")[0].offsetHeight;
        offset_height += $(inner_cards[k]).find(".description")[0].offsetHeight;

        $(inner_cards[k]).find(".effect-wrapper").css("height", card_height - offset_height + "px");
    }
  }

  function printCards(event) {
    var cards = $(".card");
    for(k in cards) {
      html2canvas(cards[k]).then(handlePrintedCanvas.bind(null, cards[k]));
      return;
    }
  }
});

function handlePrintedCanvas(card, canvas) {
  var url = canvas.toDataURL("image/png");
  var link = document.createElement('a');
  link.href = url;
  var card_name = $(card).find(".title").text().trim();
  var number = $(card).data("num");
  link.download =  card_name + "-" + number + '.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}