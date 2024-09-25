const express = require("express");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();
const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

const databse = require("./config/database");
databse.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");


app.set('views', `${__dirname}/views`); // Tìm đến thư mục tên là views / Sử dụng trực tiếp biến dirname để môi trường deploy hiểu 
app.set('view engine', 'pug'); // template engine sử dụng: pug

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Khai báo biến toàn cục cho file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('MINHHOA-FLASH'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
