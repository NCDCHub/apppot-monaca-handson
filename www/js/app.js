/** 全体の設定 **/
var AppPot = AppPotSDK.getService({
  url: 'https://trial.apppot.net/apppot/',
  appId: 'xxxx',
  appVersion: '1.0.0',
  appKey: 'yyyy',
  companyId: 0
});

var navi;
ons.ready(function() {
  navi = document.getElementById('navi');
  document.addEventListener('show', function(event) {
    switch(event.target.id){
      case 'list-page':
        getCustomerList();
        break;
    }
  });
});


/** ログイン画面 **/
function login() {
  var userName = document.getElementById('userName').value;
  var password = document.getElementById('password').value;

  /******** Exercise 3 : ログイン機能の実装 ********/
  AppPot.LocalAuthenticator.login(userName, password)
  .then(() => {
    console.log("ログインしました。");
    navi.pushPage('list.html');
  })
  .catch((error) => {
    console.log("ログインに失敗しました。");
    alert('ログインに失敗しました');
  });
  /******** Exercise 3 : ここまで ********/
}


/** 取引先一覧画面 **/
function getCustomerList() {
  AppPot.Gateway.get("customer-db", "CustomerCompany", null, null, null)
  .then((response) => {
    console.log(JSON.stringify(response));
    var list = document.getElementById('customerList');
    list.innerHTML = '';
    var customerData = response.CustomerCompany || [];
    customerData.forEach((customer, index) => {
      var template = '<ons-list-item modifier="chevron" onclick="showCustomerData(' + customer.companyId + ')">' + customer.companyName + '</ons-list-item>';
      ons.createElement(template, { append: list });
    });
  });
}

function addCustomerData() {
  navi.pushPage('regist.html');
}


/** 取引先詳細画面 **/
function showCustomerData(companyId) {
  var page;
  navi.pushPage('detail.html').then((_page) => {
    page = _page;
    /******** Exercise 4 : 既存データベースへのSELECT機能の実装 ********/
    return AppPot.Gateway.get("customer-db", "query", {
        query: "select * from CustomerCompany where companyId = '" + companyId + "'"
    }, null);
  })
  .then((response) => {
    var customer = response.query[0];
    renderCustomerData(page, customer);
    /******** Exercise 4 : ここまで ********/
  });
}

function renderCustomerData(page, customer) {
  page.querySelector('[name="companyName"]>div').textContent = customer.companyName;
  page.querySelector('[name="companyNameKana"]>div').textContent = customer.companyNameKana;
  page.querySelector('[name="zipCode"]>div').textContent = customer.zipCode;
  page.querySelector('[name="address"]>div').textContent = customer.address;
  page.querySelector('[name="phoneNumber"]>div').innerHTML = '<a href="tel:' + customer.phoneNumber + '">' + customer.phoneNumber + '</a>';
}


/** 取引先登録画面 **/
function regist() {
  var requestJson = getSendData();
  /******** Exercise 5 : 既存データベースへの登録機能の実装 ********/
  AppPot.Gateway.post("customer-db", "CustomerCompany", null, requestJson, null)
  .then((response) => {
    alert("登録しました");
    return navi.popPage();
  });
  /******** Exercise 5 : ここまで ********/
}

function getSendData() {
  return {
    "companyName" : document.getElementById('companyName').value,
    "companyNameKana" : document.getElementById('companyNameKana').value,
    "zipCode" : document.getElementById('zipCode').value,
    "address" : document.getElementById('address').value,
    "phoneNumber" : document.getElementById('phoneNumber').value
  };
}
