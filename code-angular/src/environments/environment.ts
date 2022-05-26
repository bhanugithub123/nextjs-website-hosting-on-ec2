export const environment = {
  production: false,
  // API_URL_HEAD : 'http://103.46.239.133:8083/api/',
  API_URL_HEAD: window["env"]["apiUrl"] + 'api/',
  debug: window["env"]["debug"] || false
}