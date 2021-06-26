// load đồng thời các file khi save: nodemon ... -e js,hbs

const express = require("express");
const path = require("path");
const hbs = require("hbs"); // giúp viết reusable file, một phần của web
const { title } = require("process");

const app = express();

const publicDirection = path.join(__dirname, "../public"); // lấy path
console.log(__dirname);

const viewPath = path.join(__dirname, "../views");
const partialPath = path.join(__dirname, "../partial");

// set up static file serving
app.use(express.static(publicDirection)); // serve các static file chứa trong path

//set up direction hbs serving
app.set("view engine", "hbs"); // render các file có đuôi .hbs, có thể render các file khác: .html,..
// tên folder chứa hbs file  có tên default là 'views'
app.set("views", viewPath);

hbs.registerPartials(partialPath); // load partial direction, syntax hbs: {{<nameOfParitalFile}}

app.get("", (req, res) => {
  res.render("index", {
    // render file có tên là index.hbs cùng với option object(sử dụng syntax {{}} để lấy dynamic value)
    title: "weather app",
    name: "khoa",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    name: "Nguyen Duc Khoa",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Help Page",
    name: "Nguyen Duc Khoa",
    title: "Help",
  });
});

//tạo một route
// nhắc lại: get method được cung cấp bởi express npm nên nó là một asynchronous function
// app.get("", (req, res) => {
//   // route '' tức là trỏ trang chính
//   res.send("<h1>Hello Express</h1>"); // serve HTML
// });

// // tạo một route khác
// app.get("/help", (req, res) => {
//   // serve JSON, send() sẽ tự động chạy JSON.stringify(...)
//   res.send([{ name: "khoa" }, { name: "hanh" }]);
// });

// app.get("/about", (req, res) => {
//   res.send("<h2>About page </h2>");
// });

const geocode = require("./utility/geocode");
const weathercode = require("./utility/weatherstack");

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    // req.query ~ ?key=value&...
    return res.send({
      error: "You must provide an address",
    });
  } else {
    geocode.geocode(
      req.query.address,
      (error, { latitude, longtitude }={}) => {
        if (error) {
          return res.send({error})
        }

        weathercode.weathercode(latitude, longtitude, (error, focastData) => {
          if (error) {
            return res.send({error})
          }
          res.send([
            {
              temperature: focastData.temperature,
              feelLike: focastData.feelLike,
              location: req.query.address,
            },
          ]);
        });
      }
    );
  }
});

app.get("/help/*", (req, res) => {
  res.render("404-page", {
    title: "404-page",
    name: "Nguyen Duc Khoa",
    errorMessage: "Help article not found",
  });
});

// page lỗi nên match url cuối cùng
// * mang nghĩa những cái còn lại mà code trên chưa có
app.get("*", (req, res) => {
  res.render("404-page", {
    title: "404-page",
    name: "Nguyen Duc Khoa",
    errorMessage: "Page not found",
  });
});

app.listen(3000, () => {
  // cổng 3000(local) ~ start server trên cổng 3000
  console.log("Server start up");
});

// Lưu ý: page sẽ match url và load theo quy tắc từ trên xuống dưới, tức là nếu 'match' thành công -> không xét code phía dưới nữa

/*
  Sử dụng git
  git init: khởi tạo git
  git status: các untrackfile, .gitignore để chứa file không muốn sử dụng git
  git add: thêm file vào staged file -> để chuẩn bị thêm vào commit
  git commit -m "...":  tạo commnit với message

  Sử dụng SSH key để chuyển code từ máy tính của chúng ta với bên thứ 3 một cách an 
  toàn
  tạo ssh key: ssh-keygen -t rsa -b 4096 -C "ssh key generate"
  Xem ssh key: ls -a -l ~/.ssh
  Sử dụng: eval  "$(ssh-agent -s)"
  ssh-add  ~/.ssh/id_rsa
  Kiểm tra kết nối: ssh -T git@github.com
*/