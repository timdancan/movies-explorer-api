const express = require("express");
const mongoose = require("mongoose");
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");

const {
  PORT = 3000,
  MONGO_URL = "mongodb://localhost:27017/mestodb",
} = process.env;

const app = express();
app.use(express.json());

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  await app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

app.use("/users", usersRoutes);
app.use("/movies", moviesRoutes);

main();
