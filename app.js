const express = require("express");
const jwt = require("jsonwebtoken");
const port = 3003;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

let user = {
  id: "6452ejkkn7e20390po3ruy",
  email: "anantharajesh12@gmail.com",
  password: "mbvbcxfdxgrtrjkyguhjl8676r5ydgcuvkrki",
};
const JWT_SECRET = "my-secret-1234";

app.get("/", (req, res) => {
  res.send("hello my frd");
});
app.get("/forget-password", (req, res, next) => {
  res.render("forget-password");
});
app.post("/forget-password", (req, res, next) => {
  const { email } = req.body;

  //check user avilable
  if (email !== user.email) {
    res.send("user not register in db");
    return;
  }
  //check one time password
  const secret = JWT_SECRET + user.password;
  const paylode = {
    email: "user.email",
    id: "user.id",
  };
  const token = jwt.sign(paylode, secret, { expiresIn: "30m" });
  const link = `http://localhost:3003/reset-password/${user.id}/${token}`;
  console.log(link);
  res.send("password reset link sent to ur email was sucessfully");
});
app.get("/reset-password/:id/:token", (req, res, next) => {
  const { id, token } = req.params;

  if (id !== user.id) {
    res.send("invalid id bro");
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    const paylode = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});
app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  if (id !== user.id) {
    res.send("invaild id bro...");
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    const paylode = jwt.verify(token, secret);
    user.password = password;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.listen(port, () => {
  console.log(`server running on link http://localhost:${port}`);
});
