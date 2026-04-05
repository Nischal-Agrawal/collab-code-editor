const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const fetch = require("node-fetch");


const app = express();
const server = http.createServer(app);

const { getTotalUsers } = require("./services/roomService");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  // res.send(`
  //   <h1>🚀 Collaborative Code Editor Backend</h1>
  //   <p>Status: Running</p>
  //   <p>Use frontend to interact with this server.</p>
  // `)
  res.send(`
  <div style="font-family: Arial; text-align:center; margin-top:50px;">
    <h1>🚀 Backend Running</h1>
    <p>Real-time server is active</p>
  </div>
  `);
});


const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import socket handler
require("./socket/socketHandler")(io);


app.post("/run", async (req, res) => {
  try {
    const { code, language } = req.body;

    // Default
    let pistonLang = "javascript";
    let version = "18.15.0";

    // Language mapping
    switch (language) {
      case "python":
        pistonLang = "python";
        version = "3.10.0";
        break;

      case "cpp":
        pistonLang = "cpp";
        version = "10.2.0";
        break;

      case "javascript":
      default:
        pistonLang = "javascript";
        version = "18.15.0";
        break;
    }

    //  CALL PISTON API
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: pistonLang,
        version: version,
        files: [
          {
            content: code
          }
        ]
      })
    });

    const data = await response.json();

    // Debug log
    console.log("PISTON RESPONSE:", data);

    // Send response to frontend
    res.json(data);

  } catch (err) {
    console.error("Execution Error:", err);
    res.status(500).json({
      error: "Execution failed",
      details: err.message
    });
  }
});


// server.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use((req, res) => {
  res.status(404).send(`
    <h2>404 - Route Not Found</h2>
    <p>This endpoint does not exist.</p>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "Running",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform
  });
});

app.get("/users", (req, res) => {
  res.json({
    activeUsers: getTotalUsers()
  });
});
