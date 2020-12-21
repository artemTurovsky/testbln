import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from "cors";
import MongoDB from "connect-mongodb-session";

// Настройка сервера
dotenv.config();
const logger = console;
const app = express();
const MongoDBStore = MongoDB(session);
const store = new MongoDBStore({
  uri: process.env.DB_URL ?? 'mongodb://localhost:27017/belineTest',
  collection: "sessions",
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set("session cookie name", "sid");
app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    name: app.get("session cookie name"),
    secret: process.env.SESSION_SECRET ?? 'fdsfwerqfd',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);

// Логика сокетов
const socketServer = createServer();

const io = new Server(socketServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
})

io.on('connection', (socket) => {
  const userName = JSON.parse(JSON.stringify(socket.handshake.query)).userName;
  socket.on('message', (data) => {
    io.emit('broadcast', { from: userName, message: data.message })
  });
})

const socketPort = process.env.PORT_SOCKET ?? 8000

socketServer.listen(socketPort);
logger.log('Сокет сервер запущен, порт: ' + socketPort);


// Логика сервера

app.post('/sessinonCheck', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, userName: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
})

app.post('/sessionStart', async (req, res) => {
  req.session.user = req.body.name;
  res.json({ authenticated: true, userName: req.session.user });
})

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  logger.log('Сервер запущен, порт: ' + port);
})
