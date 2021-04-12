$(document).ready(function () {

  $("#uploadForm").on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var url = form.attr('action');
    var file = $('#txFile')[0].files[0];
    var formData = new FormData();
    formData.append('txFile', file);

    var $loader = $("#loader")
    var $table = $("#resultTable")
    $loader.show();
    $table.hide();
    $.ajax({
      type: "POST",
      url: url,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        console.log(data);
        pouplateData(data);
        $loader.hide();
        $table.show();
      }
    });
  });
  var pouplateData = function (data) {
    var html = '';
    // $("#primaryAccount").html(Object.keys(data)[1])
    $("#primaryAccountTokens").html(data.primaryAccountTokens)
    data.txDetailsArray.forEach(item => {
      html += `<tr><td>${item.account}</td><td>${item.balance}</td><td><a target='_blank' href="https://ropsten.etherscan.io/tx/${item.txHash}">${item.txHash}</a></td></tr>`;
    });
    $("#data").html(html)
  }

  $("form").on("change", function () {
    
    $("#uploadFile").attr('disabled', !$("#txFile").val())
    $(".file-upload-wrapper").attr("data-text", $("#txFile").val().replace(/.*(\/|\\)/, ''));
  });
});