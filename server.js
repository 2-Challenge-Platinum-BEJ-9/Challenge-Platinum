const httpServer = require("./main");
const port = 3000;

httpServer.listen(port, () => {
  console.log(`This app running at http://localhost:${port}`);
});
