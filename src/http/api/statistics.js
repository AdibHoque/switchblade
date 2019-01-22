const { Route } = require('../../index')
const { Router } = require('express')
const i18next = require('i18next')

module.exports = class Status extends Route {
  constructor (client) {
    super(client)
    this.name = 'statistics'
  }

  register (app) {
    const router = Router()

    router.get('/', (req, res) => {
      const payload = {
        serverCount: this.client.guilds.size,
        userCount: this.client.users.size,
        uptime: process.uptime() * 1000,
        commandCount: this.client.commands.length,
        languageCount: Object.keys(i18next.store.data).length
      }

      res.status(200).json(payload)
    })

    app.use(this.path, router)
  }
}