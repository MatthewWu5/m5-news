import axios from 'axios'

axios.interceptors.request.use(function(config) {
  $loading.show('loading...')
  return config
})

axios.interceptors.response.use(
  function(res) {
    $loading.hide()
    return res
  },
  function(error) {
    $loading.hide()
    console.error(error)
    return Promise.reject(error)
  }
)

module.exports = axios
