# validURL

validating URLs is tricky job. There are tons of approaches. This is my liberal approach.

## Features
- supports any protocols (https|http|ftp|arbitrary)://
- supports ipv6 hostnames
- supports punycode urls
- tested against 1.3M URLs


## Testing
testing might take a while, since we are testing against 1.3Million URLs. Test files are only available at github clone. They will be ignored for npm package.

`npm run test`

## Install
```
npm i --save @7c/validurl
```

## Usage
```
const validURL = require('@7c/validurl')

console.log(validURL('http://localhost'))
```


All kind of bugreports are welcome