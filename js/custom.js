
let data;
let selectArea = document.querySelector('#selectArea');
let area = ["顯示全部", "臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣",]

let exhibitionList = document.querySelector('.exhibitionList ul');
let noticeTxt = document.querySelector('.noticeTxt')
let title = document.querySelector('.title');
let startTime = document.querySelector('.startTime');
let endTime = document.querySelector('.endTime');
let showUnit = document.querySelector('.showUnit');
let locationName = document.querySelector('.locationName');
let price = document.querySelector('.price');
let moreInfo = document.querySelector('.moreInfo');
let website = document.querySelector('.website');

let timeData = document.querySelector('.timeData');
let Today = new Date();


/* 列出所有縣市 */
function getOption() {
    for (let j = 0; j < area.length; j++) {
        let areaOption = document.createElement('option');
        areaOption.setAttribute('value', area[j]);
        areaOption.textContent = area[j];
        selectArea.appendChild(areaOption);
    }
}
getOption();


/* 產出當下時間 */
function showTime() {
    timeData.textContent = ` ${Today.getFullYear()}年 ${(Today.getMonth() + 1)}月 ${Today.getDate()}日`;
}
showTime();


/* 使用AJAX */
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://abby-tsai.github.io/data/govdata.json', true);
xhr.send(null);

xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    showList();
    showMap();
}


/* 渲染地圖 */
function showMap() {

    let map = L.map("map", {
        center: [data[0]["latitude"], data[0]["longitude"]],
        zoom: 25
    });

    // 設定圖資來源
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        // 預設的設定
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); // 放到#map

    /* 設定圖釘顏色 */
    let greenIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    /* 把json資料渲染到地圖上 */
    for (let f = 0; data.length > f; f++) {
        L.marker([data[f]["latitude"], data[f]["longitude"]], { icon: greenIcon })
            .addTo(map)
            .bindPopup(
                `
                <div class="descBox">
                    <div class="image mb-1">
                        <img src="${data[f]["representImage"]}" alt="">
                    </div>
                    <div class="title mb-1">
                        ${data[f]["caseName"]}
                    </div>
                    <div class="time position-relative pl-2">
                        <i class="fas fa-clock position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                        公告日期
                        <div class="startTime">${data[f]["registerDate"]}</div>
                    </div>
                    <div class="showLocation position-relative pl-2 mb-1">
                        <i class="fas fa-map-signs position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                        <div class="showUnit">${data[f]["govDeptAddress"]}</div>
                    </div>
                    <div class="price">
                    ${data[f]["judgeCriteria"]}
                    </div>
                </div>
                `
            );
    }
}


/* 列出清單 */
function showList(e) {
    let temp = [];
    let str = '';
    let select;

    if (!e) {
        select = area[0];
    } else {
        select = e.target.value;
    }

    for (let i = 0; i < data.length; i++) {

        if (data[i]["belongCity"].includes(select) == true) {
            noticeTxt.innerHTML = '';
            temp.push(data[i]);

        } else if (select === area[0]) {
            noticeTxt.innerHTML = '';
            temp.push(data[i]);

        } else if (temp.length === 0) {
            noticeTxt.innerHTML = '此縣市目前沒有展演活動';
        }

        /* 如果價格欄位是空的，就回傳'無備註票價' */
        // if (data[i]["showInfo"][0]["price"].length === 0) {
        //     data[i]["showInfo"][0]["price"] = '無備註票價';
        // }
    }

    for (let j = 0; j < temp.length; j++) {
        str +=
            `
        <li>
            <div class="descBox">
                <div class="title mb-1">
                ${temp[j]["caseName"]}
                </div>
                <div class="time position-relative pl-2">
                    <i class="fas fa-clock position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                    公告日期
                    <div class="startTime">${temp[j]["registerDate"]}</div>
                </div>
                <div class="showLocation position-relative pl-2 mb-1">
                    <i class="fas fa-map-signs position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                    <div class="showUnit">${temp[j]["govDeptAddress"]}</div>
                </div>
                <div class="price">
                ${temp[j]["judgeCriteria"]}
                </div>
            </div>
            <div class="buttonBox">
                <div class="d-flex">
                    <div class="Block--6">
                        <a href="#" class="moreInfo" data-title="${temp[j]["caseName"]}">
                            <i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>
                            地圖位置
                        </a>
                    </div>
                    <div class="Block--6">
                        <a href="${temp[j]["caseUrl"]}" target="_blank" class="website">
                            <i class="fas fa-globe-asia" style="margin-right: 5px;"></i>
                            前往官網
                        </a>
                    </div>
                </div>
            </div>
        </li>
        `;

    }
    exhibitionList.innerHTML = str;

}


/* 當點擊到指定古蹟，map就會跳轉過去 */
function matchToMap(e) {
    e.preventDefault();
    for (let x = 0; data.length > x; x++) {
        if (e.target.dataset.title == data[x]["caseName"]) {
            map.setView([data[x]["latitude"], data[x]["longitude"]], 20);
        }
    }

}


selectArea.addEventListener('change', showList);
exhibitionList.addEventListener('click', matchToMap);

