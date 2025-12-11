const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, 'bot') })
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
    'Добро пожаловать в Институт астрологии и психологии. Откройте приложение по кнопке ниже',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть в Telegram', webappUrl),
    ])
  )
})

bot.command('webapp', (ctx) => {
  return ctx.reply(
    'Добро пожаловать в Институт астрологии и психологии. Откройте приложение по кнопке ниже',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть в Telegram', webappUrl),
    ])
  )
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
