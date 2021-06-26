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

	/* 先執行一次showList，列表才會先列出來 */
	showList();
	/* 當我select換選單的時候，又觸發showList function */
	selectArea.addEventListener('change', showList);


	/* 設定 markerClusterGroup */

	let map = L.map('map', {
		center: [data[0]["latitude"], data[0]["longitude"]],
		zoom: 18
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	let redIcon = new L.Icon({
		iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
		shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	let markers = new L.MarkerClusterGroup().addTo(map);

	for (let f = 0; data.length > f; f++) {

		/* 因為資料有些經緯度是null，會報錯。所以設定 : 如果經度 & 緯度都有值，才跑下面的內容 */
		if (data[f]["latitude"] && data[f]["longitude"]) {

			markers.addLayer(
				L.marker([data[f]["latitude"], data[f]["longitude"]], { icon: redIcon })
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
				)
			)
		}

	}
	map.addLayer(markers);


	/* 當點擊到指定古蹟，map就會跳轉過去 */
	exhibitionList.addEventListener('click', function (e) {
		e.preventDefault();
		for (let x = 0; data.length > x; x++) {
			if (e.target.dataset.title == data[x]["caseName"]) {
				map.setView([data[x]["latitude"], data[x]["longitude"]], 18);

			}
		}
	});

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