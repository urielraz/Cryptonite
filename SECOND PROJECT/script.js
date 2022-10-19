let coins = [];
let chosen_coins = [];
// let blablabla;

const app = document.querySelector("#navi");
moveTo("Coins");

function navTo(el) {
  event.preventDefault();
  const target = el.dataset.target;
  moveTo(target);
  document
    .querySelectorAll("nav>ul>li> a")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-target='${target}']`).classList.add("active");
}

function moveTo(target) {
  let html;

  switch (target) {
    case "Coins":
      html = Coins();
      break;
    case "Reports":
      html = Reports();
      break;
    case "About":
      html = About();
      break;
    default:
      html = Coins();
      break;
  }

  app.innerHTML = nav();
  app.innerHTML += html;
}

function nav() {
  return `<nav class="sticky-top  navbar-expand-sm bg-light navbar-light d-flex " >
                <ul class="nav  nav-pills">
                    <li class="nav-item">
                        <a class="nav-link active" onclick="navTo(this)" data-target='Coins' href="#Coins">Coins</a>
                        
                    </li>

                    <li class="nav-item">
                       <a class="nav-link" onclick="navTo(this)" data-target='Reports' href="#Reports">Reports</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" onclick="navTo(this)" data-target='About' href="#About">About</a>
                    </li>
                
                </ul>
            </nav>
            `;
}

function Coins() {
  return `
  </br>
  <div class="d-flex my_search " role="search">
          
              <input
                id="search_bar"
                class="form-control card  "
                type="search"
                placeholder="Search Coins"
                aria-label="Search"
              />
              <button onclick="search_coins()"  class="btn btn-outline-success  " type="submit">
                Search
              </button>
            
            </div>
                </br></br>
  <div class="block Coins">
    ${start_loader()}
    <div  ${get_coins()} id="my_data"></div>
   
  </div>
  `;
}

function search_coins() {
  const search_bar = document.querySelector("#search_bar");
  const search_string = search_bar.value;
  // console.log(search_string);
  // event.preventdefault();
  if (search_string.length == 1) {
    alert("יש להכניס מינימום 2 תווים לחיפוש");
    return;
  }
  // console.log(search_string);
  // const filtered_coinsss = coins.filter((the_coin) => {
  //   return !the_coin.symbol.includes(search_string);
  // });
  // console.log(filtered_coinsss);
  const filtered_coins = coins.filter((the_coin) => {
    return (
      the_coin.symbol.includes(search_string) ||
      the_coin.name.includes(search_string)
    );
  });
  if (filtered_coins == 0) {
    alert("לא נמצאו נתונים להצגה");
    return;
  }
  print_coins(filtered_coins);
}

function About() {
  return `<div class="block About">
                
                </br>
                <h4><p>Hi there!</p>
                my name is Uriel Raz, and the application I developed helps us work with virtual currencies.</br> You can get up-to-date information about the specific currency you choose, converted to dollars, Euro and shekel. </h4>
                <div>
                <img src="/assets/uriel_raz.jpg" alt="uriel's img" width="300">
                </div>
                <div>
                </br>
                </br>
                </br>
                <h5> &copy all the rights reserved
                </br>
                1urielraz@gmail.com </h5>
                </div>
            </div>`;
}

function start_loader() {
  return `
  
    <div class="loader"></div>
       
        `;
}
function stop_loader() {
  let loader = document.querySelector(".loader");
  loader.classList.add("hide");
}

async function get_coins() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/list/"
    );
    coins = await response.json();
    coins.splice(2000, 12000);
    print_coins(coins);
    stop_loader();
  } catch (error) {
    alert(error);
  }
}
function print_coins(coins) {
  let my_data = document.querySelector("#my_data");

  let html = "";
  for (let i = 0; i < coins.length; i++) {
    html += `
   
  <div class="row">
     <div class="col-sm-3">
         <div class="card">
             <div class="card-body">
             <h5 class="card-title">${coins[i].symbol}</h5>
             <label  class="switch">
                 <input id="item_of_chosen${coins[i].symbol}"
                 
                 type="checkbox" onchange="popup_window('${coins[i].symbol}')">
                 <span   class="slider round" ></span>
              </label>
                 
        <p class="card-text">${coins[i].name}</p>

        <!--  collapse: -->
        
        <p>
        
        <button class="btn btn-primary" type="button" data-bs-toggle="collapse" 
        onclick="print_more_info('${coins[i].id}')" 
        data-bs-target="#collapseExample${coins[i].id}" 
        aria-expanded="false" aria-controls="collapseExample">
          more info
        </button>
      </p>
      <div class="collapse" id="collapseExample${coins[i].id}">
      
          <div  >
          
           </div>

      </div>
      <!-- collapse until here -->
                </div>
           </div>
        </div>
    </div>
</div>
`;
  }
  my_data.innerHTML = html;

  if (chosen_coins.length) {
    for (i = 0; i < chosen_coins.length; i++) {
      document.querySelector(
        `#item_of_chosen${chosen_coins[i]}`
      ).checked = true;
    }
  }
}

let coins_data = {};
async function print_more_info(coin) {
  const coin_info = document.querySelector(`#collapseExample${coin}`);
  coin_info.innerHTML += start_loader();
  // coin_info.innerHTML += `<div class="loader"></div>`;

  let more_info_of_coin;
  if (
    coin in coins_data &&
    (new Date().getMinutes() - coins_data[coin].minutes < 2 ||
      new Date().getMinutes() - coins_data[coin].minutes == -59)
  ) {
    more_info_of_coin = coins_data[coin];
    // console.log(new Date().getMinutes() - coins_data[coin].minutes);

    // console.log(coins_data[coin]);
  } else {
    more_info_of_coin = await more_info_from_api(coin);
    coins_data[more_info_of_coin.id] = more_info_of_coin;
    // coins_data[more_info_of_coin.id].hours = new Date().getHours();
    coins_data[more_info_of_coin.id].minutes = new Date().getMinutes();
    // console.log(coins_data[more_info_of_coin.id].hours);
    // console.log(coins_data[more_info_of_coin.id].minutes);
    // console.log(coins_data);
  }

  let html = `
  <div class="more_info">

    <div >
    <img id="img_more_info"  src="${more_info_of_coin.image.small}" />
    </div>

    USD: ${more_info_of_coin.market_data.current_price.usd}$
    </br>
    EUR: ${more_info_of_coin.market_data.current_price.eur}€
    </br>
    ILS: ${more_info_of_coin.market_data.current_price.ils}₪
  </div>
  `;

  coin_info.innerHTML = html;
  // stop_loader();
}
async function more_info_from_api(coin) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/" + coin
    );
    const more_info_of_coin = await response.json();

    return more_info_of_coin;
  } catch (error) {
    alert(error);
  }
}

function popup_window(symbol) {
  if (chosen_coins.includes(symbol)) {
    chosen_coins = chosen_coins.filter((value) => value != symbol);
  } else if (chosen_coins.length < 5) {
    chosen_coins.push(symbol);
    console.log(chosen_coins);
  } else {
    document.querySelector(`#item_of_chosen${symbol}`).checked = false;

    show_modal(chosen_coins, symbol);
  }
}
function show_modal(chosen_coins, symbol) {
  let html = ``;

  for (let i = 0; i < chosen_coins.length; i++) {
    html += `
    <button type="button" onclick="delete_from_popup('${chosen_coins[i]}','${symbol}')" class="btn btn-warning">${chosen_coins[i]}</button>

    `;
  }

  document.querySelector("#the_modal").innerHTML = ` 
  <section >
  <div
    class="modal fade "
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-lg modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
          Too much choices
          </h5>
          <button
            type="button"
            class="close close_modal"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
        <h6>If you want to compare <b><b>${symbol}</b></b> coin as well, you need delete a coin from the list below:</h6>
        <div  id="model_chosen_list"></div>
          ${html}
          
        </div>

        <div class="modal-footer">
          <button
            type="button"
            id="close_modal"
            class="close_modal btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <!-- <button type="button" class="btn btn-primary">
            Save changes
          </button> -->
        </div>
      </div>
    </div>
  </div>
</section>`;
  $("#exampleModal").modal("show");
  $(".close_modal").on("click", function () {
    $("#exampleModal").modal("hide");
  });
}
function delete_from_popup(coin_for_del, the_new_coin) {
  $("#exampleModal").modal("hide");
  document.querySelector(`#item_of_chosen${coin_for_del}`).checked = false;
  document.querySelector(`#item_of_chosen${the_new_coin}`).checked = true;
  chosen_coins = chosen_coins.filter((value) => value != coin_for_del);
  chosen_coins.push(the_new_coin);
}

//מכאן והלאה הבונוס:

function Reports() {
  get_graph();
  return `
  <div id="chartContainer" style="height: 300px; width: 100%;"></div>
`;
}
async function get_graph() {
  let bdika222 = await graph(chosen_coins);
  // console.log(bdika222);

  var dataPoints = [bdika222];

  var options = {
    theme: "light2",
    title: {
      text: "Live Data",
    },
    data: [
      {
        type: "line",
        dataPoints: dataPoints,
      },
    ],
  };
  $("#chartContainer").CanvasJSChart(options);
  updateData();

  // Initial Values
  var xValue = 0;
  var yValue = 10;
  var newDataCount = 6;

  function addData(data) {
    if (newDataCount != 1) {
      $.each(data, function (key, value) {
        dataPoints.push({ usd: value[0], y: parseInt(value[1]) });
        xValue++;
        yValue = parseInt(value[1]);
      });
    } else {
      //dataPoints.shift();
      dataPoints.push({ x: data[0][0], y: parseInt(data[0][1]) });
      xValue++;
      yValue = parseInt(data[0][1]);
    }

    newDataCount = 1;

    $("#chartContainer").CanvasJSChart().render();
    setTimeout(updateData, 1500);
  }

  function updateData() {
    $.getJSON(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD",
      addData
    );
  }

  return;
  return `
  <div class="block Coins">
    ${start_loader()}
    <div  ${graph(chosen_coins)} id="my_data2"></div>
   
  </div>
  
  `;

  if (chosen_coins.length) {
    return `<div id="chartContainer" style="height: 300px; width: 100%;"></div>

    <div class="block Reports">
                <h2>Reports</h2>
                ${chosen_coins}

                <p>This is the Reports page</p>
            </div>`;
  }
  return `<div class="block Reports">
                <h2>Reports</h2>
                
                <p>לא הוכנס שום מטבע</p>
            </div>`;
}

let coins2 = [];
// console.log(coins2);
async function graph(chosen_coins) {
  try {
    // console.log(chosen_coins);
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chosen_coins}&tsyms=USD`
    );
    coins2 = await response.json();
    return coins2;
    print_graph(coins2);
    stop_loader();
  } catch (error) {
    alert(error);
  }
}
function print_graph(coins2) {
  let html = "";
  for (const item of coins2) {
    console.log(item[usd]);
  }
  let my_data2 = document.querySelector("#my_data2");

  my_data2.innerHTML = html;
}
