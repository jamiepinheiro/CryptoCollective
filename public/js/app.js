const coins = ['bitcoin', 'ethereum', 'ripple', 'cardano', 'litecoin', 'nem', 'neo', 'stellar', 'eos', 'iota', 'dash', 'monero'];

var updateCoin = (i) => {
  $.get('/predictions/' + coins[i], (data) => {
    console.log(data);
    $(`#${coins[i]}`).text(Math.round(data.chances * 100) + '%');
    if (data.chances > 0.5) {
      $(`#${coins[i]}-card`).animate({
          backgroundColor: `rgb(0, 256, 100, ${data.chances})`
      }, 1000);
    }else {
      $(`#${coins[i]}-card`).animate({
          backgroundColor: `rgb(256, 0, 0, ${1 - data.chances})`
      }, 1000);
    }
    setTimeout(updateCoin((i + 1) % 12), 5000);
  }).fail(() => {
    setTimeout(updateCoin(i, 10000));
  });
}

updateCoin(0);
