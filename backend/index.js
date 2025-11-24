require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')

const token = process.env.BOT_TOKEN
const webappUrl = process.env.WEBAPP_URL

if (!token || !webappUrl) {
  console.error('BOT_TOKEN или WEBAPP_URL не заданы')
  process.exit(1)
}

const bot = new Telegraf(token)

bot.start((ctx) => {
  return ctx.reply(
    'Добро пожаловать! Откройте веб‑приложение по кнопке ниже.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть в Telegram', webappUrl),
      Markup.button.url('Открыть в браузере', webappUrl),
    ])
  )
})

bot.command('webapp', (ctx) => {
  return ctx.reply(
    'Откройте веб‑приложение по кнопке ниже.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть в Telegram', webappUrl),
      Markup.button.url('Открыть в браузере', webappUrl),
    ])
  )
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))