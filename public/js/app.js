console.log("Client side javascript file is loaded");

const weatherSearchForm = document.querySelector("form");
const inputSearch = document.querySelector("input");

const messageOne = document.getElementById("message-one");
const messageTwo = document.getElementById("message-two");

weatherSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const address = inputSearch.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";
  // sử dụng fetch() để lấy data từ url,request
  fetch("http://localhost:3000/weather?address=" + address).then((res) => {
    // json() ~ JSON.parse(res) và trả về Object data
    res.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = `Temperature of ${address}: ` + data[0].temperature;
        messageTwo.textContent = `FeelLike of ${address}: ` + data[0].feelLike;
      }
    });
  });
});
