const net = require('net')
const querystring = require('querystring')

function validHostname(domainName) {
    var domainNameRegex = /^(?:[a-z0-9](?:[a-z0-9_\-]{0,61}[a-z0-9])?\.){0,126}(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9]))\.?$/i
    // is an ip host
    if (net.isIPv4(domainName) || net.isIPv6(domainName.replace(/[\[\]]/g,''))) return true
    // remove last '.'
    domainName=domainName.replace(/\.$/,'')
    if (domainName.length < 2) return false
    if (domainName.length > 255) return false
    
    if (domainName.search(/\./)<0 && domainName.search(/^[0-9]+$/)==0) {
        // using numbers without . in body
        return false
    }

    return domainNameRegex.test(domainName)
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = (host) => {
        if (!host) return false
        if (typeof host!=='string') return false

        // we accept any protocol
        // we normalize hosts without protocol
        // if (host.search(/^[a-z]+:\/\//i)!==0) {
        if (host.search(/^[^/]+\/\//)!==0) {
            // no protocol
            if (host.search(/^\//)<0) {
                if (host.search(/\:80/)>0) host='http://'+host;
                else if (host.search(/\:443/)>0) host='https://'+host;
                else host='http://'+host;
            }
        }

        try {
            var U = new URL(host)
            // console.log(U)
            if (host.search(escapeRegExp(U.search.toString()))<0) {
                // search was not escaped properly
                return false
            }

            if (host.search(escapeRegExp(U.pathname.toString()))<0) {
                // pathname must be encoded
                return false
            }

            if (host.search(escapeRegExp(U.hostname))<0) {
                // new URL('http://123.123.123') returns .hostname='123.123.0.123' // strange
                return false
            }
            // console.log(U)
            querystring.encode(U.search)
            if (!validHostname(U.hostname)) return false
            return true
        }catch(err) {
            // console.log(err)
            // ignore
        }
        return false
}