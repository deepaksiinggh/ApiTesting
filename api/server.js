import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Simple API Key protection
server.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== "SECRET123") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
