require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

//token from the .env file
const token = process.env.BOT_TOKEN;

//new bot instance
const bot = new TelegramBot(token, { polling: true });

let users = [];

// Function to send a message to all users
const sendNotificationToAll = (message) => {
  users.forEach((userId) => {
    bot.sendMessage(userId, message);
  });
};

const sendMessage = (message, userId) => {
  bot.sendMessage(userId, message);
};

const startHour = 13;
const startMinute = 14;

const checkTimeAndSendMessage = () => {
  const now = new Date();

  const IST_Hours = now.getUTCHours() + 5;
  const IST_Minutes = now.getUTCMinutes() + 30;

  let adjustedHours = IST_Hours;
  let adjustedMinutes = IST_Minutes;

  if (adjustedMinutes >= 60) {
    adjustedMinutes -= 60;
    adjustedHours += 1;
  }

  if (adjustedHours === startHour && adjustedMinutes === startMinute) {
    sendNotificationToAll(
      "It's 1:14 PM IST! Starting alternate minute notifications."
    );
  }

  if (
    adjustedHours === startHour &&
    adjustedMinutes >= startMinute &&
    (adjustedMinutes - startMinute) % 2 === 0
  ) {
    sendNotificationToAll(
      `It's ${adjustedHours}:${
        adjustedMinutes < 10 ? "0" + adjustedMinutes : adjustedMinutes
      } PM IST! Here's your reminder!`
    );
  }
};

setInterval(checkTimeAndSendMessage, 60000);

bot.onText(/\/notify/, (msg) => {
  const message = "Hello, this is a test notification of time!";
  const userId = msg.chat.id;

  if (!users.includes(userId)) {
    users.push(userId);
  }

  sendMessage(message, userId);
});

bot.onText(/\/start/, (msg) => {
  const userId = msg.chat.id;

  if (!users.includes(userId)) {
    users.push(userId);
  }

  bot.sendMessage(userId, "Welcome! You will receive notifications.");
});
