

let xhr = new XMLHttpRequest();
xhr.open('get', 'https://abby-tsai.github.io/data/govdata.json', true);
xhr.send(null);

let selectArea = document.querySelector('#selectArea');
let area = ["臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣",]

let exhibitionList = document.querySelector('.exhibitionList ul');
let title = document.querySelector('.title');
let startTime = document.querySelector('.startTime');
let endTime = document.querySelector('.endTime');
let showUnit = document.querySelector('.showUnit');
let locationName = document.querySelector('.locationName');
let price = document.querySelector('.price');
let moreInfo = document.querySelector('.moreInfo');
let website = document.querySelector('.website');




xhr.onload = function () {
    let content = JSON.parse(xhr.responseText);

    /* 列出所有縣市 */
    for (let j = 0; j < area.length; j++) {
        let areaOption = document.createElement('option');
        areaOption.setAttribute('value', area[j]);
        areaOption.textContent = area[j];
        selectArea.appendChild(areaOption);
    }

    /* 列出展演清單 */
    function makeList() {
        let str = '';
        for (let i = 0; i < content.length; i++) {
            str +=
                `
                <li>
                    <div class="descBox">
                        <div class="title mb-1">
                        ${content[i]["title"]}
                        </div>
                        <div class="time position-relative pl-2">
                            <i class="fas fa-clock position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                            <div class="startTime">${content[i]["showInfo"][0]["time"]}</div>
                            至
                            <div class="endTime">${content[i]["showInfo"][0]["endTime"]}</div>
                        </div>
                        <div class="showLocation position-relative pl-2 mb-1">
                            <i class="fas fa-map-marker-alt position-absolute top-5 left-1" style="color: #0ba29c;"></i>
                            <div class="showUnit">${content[i]["showInfo"][0]["locationName"]}</div>
                        </div>
                        <div class="price">
                           ${content[i]["showInfo"][0]["price"]}
                        </div>
                    </div>
                    <div class="buttonBox">
                        <div class="d-flex">
                            <div class="Block--6">
                                <a href="#" class="moreInfo">
                                    <i class="fas fa-bars" style="margin-right: 5px;"></i>
                                    活動內容
                                </a>
                            </div>
                            <div class="Block--6">
                                <a href="${content[i]["webSales"]}" target="_blank" class="website">
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

    /*  */
    // function selectFunction(e) {
    //     for (let i = 0; i < content.length; i++) {
    //         let sel = e.target.value;
    //         let location = content[i]["showInfo"][0]["location"];
    //         if (location.includes(sel) == true) {
    //             console.log('共有'+ i + '個');
    //         }
    //     }
    // }

    /*  */
    function selectFunction(e) {
        for (let i = 0; i < content.length; i++) {
            let sel = e.target.value;
            let location = content[i]["showInfo"][0]["location"];
            let str = '';
            if (location.includes(sel) == true) {
                str +=
                    `
                <li>
                    <div class="descBox">
                        <div class="title mb-1">
                        ${content[i]["title"]}
                        </div>
                        <div class="time position-relative pl-2">
                            <i class="fas fa-clock position-absolute top-5 left-0" style="color: #0ba29c;"></i>
                            <div class="startTime">${content[i]["showInfo"][0]["time"]}</div>
                            至
                            <div class="endTime">${content[i]["showInfo"][0]["endTime"]}</div>
                        </div>
                        <div class="showLocation position-relative pl-2 mb-1">
                            <i class="fas fa-map-marker-alt position-absolute top-5 left-1" style="color: #0ba29c;"></i>
                            <div class="showUnit">${content[i]["showInfo"][0]["locationName"]}</div>
                        </div>
                        <div class="price">
                           ${content[i]["showInfo"][0]["price"]}
                        </div>
                    </div>
                    <div class="buttonBox">
                        <div class="d-flex">
                            <div class="Block--6">
                                <a href="#" class="moreInfo">
                                    <i class="fas fa-bars" style="margin-right: 5px;"></i>
                                    活動內容
                                </a>
                            </div>
                            <div class="Block--6">
                                <a href="${content[i]["webSales"]}" target="_blank" class="website">
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
    }

    selectArea.addEventListener('change', selectFunction);

}







