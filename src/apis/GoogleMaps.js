const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://maps.googleapis.com/maps/api'

module.exports = class GoogleMapsAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'gmaps'
    this.envVars = ['GMAPS_KEY']
  }

  // Search
  /**
   * Search a city location
   * @param {String} address The address query to search for
   * @param {String} [language=en-us] The string to the search query
   * @returns {Promise<?Object>} Returns the object of the location or returns null if not found
   */
  async searchCity (address, language = 'en-us') {
    const { status, results: [ result ] } = await this.request('/geocode', { address, language })
    if (status === 'OK' && result.address_components.some(({ types }) => {
      return types.includes('administrative_area_level_2') || types.includes('locality')
    })) {
      return result
    }
  }

  /**
   * Search a city location
   * @param {String} lat Latitude
   * @param {String} lng Longitude
   * @returns {Promise<?Object>} Timezone information from Google
   */
  async getTimezone (lat, lng) {
    const { results: [ result ] } = await this.request('/timezone', { location: `${lat},${lng}` })
    return result
  }

  // Default
  request (endpoint, queryParams = {}) {
    queryParams.key = process.env.GMAPS_KEY
    return snekfetch.get(`${API_URL}${endpoint}/json`).query(queryParams).then(r => r.body)
  }
}
