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
});

function login() {
  var userName = document.getElementById('userName').value;
  var password = document.getElementById('password').value;
  
  AppPot.LocalAuthenticator.login(userName, password)
  .then(() => {
      console.log("Logined.");
      return navi.pushPage('list.html');
  })
  .then(getCustomerList)
  .catch((error) => {
      console.log("Login failed.");
      alert('ログインに失敗しました');
  });
}

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

function showCustomerData(companyId) {
  var page;
  navi.pushPage('detail.html').then((_page) => {
      page = _page;
      return AppPot.Gateway.get("customer-db", "query", {
          query: "select * from CustomerCompany where companyId = '" + companyId + "'"
      }, null);
  })
  .then((response) => {
      var customer = response.query[0];
      page.querySelector('[name="companyName"]>div').textContent = customer.companyName;
      page.querySelector('[name="companyNameKana"]>div').textContent = customer.companyNameKana;
      page.querySelector('[name="zipCode"]>div').textContent = customer.zipCode;
      page.querySelector('[name="address"]>div').textContent = customer.address;
      page.querySelector('[name="phoneNumber"]>div').innerHTML = '<a href="tel:' + customer.phoneNumber + '">' + customer.phoneNumber + '</a>';
  });
}

function addCustomerData() {
  navi.pushPage('regist.html');
}

function regist() {
  var requestJson = {
    "companyName" : document.getElementById('companyName').value,
    "companyNameKana" : document.getElementById('companyNameKana').value,
    "zipCode" : document.getElementById('zipCode').value,
    "address" : document.getElementById('address').value,
    "phoneNumber" : document.getElementById('phoneNumber').value
  }
  AppPot.Gateway.post("customer-db", "CustomerCompany", null, requestJson, null)
  .then((response) => {
      console.log(response);
      alert("登録しました");
      return navi.popPage();
  })
  .then(getCustomerList)
}