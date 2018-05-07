let prefix = 'http://localhost:80/'
if (process.env.NODE_ENV === 'production') {
    prefix = 'http://dapi.eastasia.cloudapp.azure.com:8080/'

}

module.exports = {
    serverPrefixUrl: prefix
}