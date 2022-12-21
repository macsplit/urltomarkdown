const validURL = require('./../validURL.js')
const expect = require('chai').expect
const fs = require('fs')
const chalk = require('chalk')
const readline = require('readline')
const zlib = require('zlib');



describe("validURL Function", function () {
  this.timeout(30000000)
  url = validURL


  it("allows empty values", function () {
    expect(url(null)).to.be.false;
    expect(url(undefined)).to.be.false;
  });

  it("doesn't allow non strings", function () {
    expect(url(3.14, {})).to.be.false;
    expect(url(true, {})).to.be.false;
    expect(url({ key: "i'm a string" }, {})).to.be.false;
  });


  it("different tests", function () {

    expect(url("", {})).to.be.false;
    expect(url(" ", {})).to.be.false;
    expect(url("http://", {})).to.be.false;
    expect(url("http://.", {})).to.be.false;
    expect(url("http://..", {})).to.be.false;
    expect(url("http://../", {})).to.be.false;
    expect(url("http://?", {})).to.be.false;
    expect(url("http://??", {})).to.be.false;
    expect(url("http://??/", {})).to.be.false;
    expect(url("http://#", {})).to.be.false;
    expect(url("http://##", {})).to.be.false;
    expect(url("http://##/", {})).to.be.false;
    expect(url("http://foo.bar?q=Spaces should be encoded", {})).to.be.false;
    expect(url("//", {})).to.be.false;
    expect(url("//a", {})).to.be.false;
    expect(url("///a", {})).to.be.false;
    expect(url("///", {})).to.be.false;
    expect(url("http:///a", {})).to.be.false;
    expect(url("foo.com", {})).to.be.true;
    expect(url("rdar://1234", {})).to.be.false;
    expect(url("h://test", {})).to.be.true;
    expect(url("http:// shouldfail.com", {})).to.be.false;
    expect(url(":// should fail", {})).to.be.false;
    expect(url("http://foo.bar/foo(bar)baz quux", {})).to.be.false; // must be encoded
    expect(url("ftps://foo.bar/", {})).to.be.true;
    expect(url("http://-error-.invalid/", {})).to.be.false;
    expect(url("http://-a.b.co", {})).to.be.false;
    expect(url("http://a.b-.co", {})).to.be.false;
    expect(url("http://0.0.0.0", {})).to.be.true;
    expect(url("http://10.1.1.0", {})).to.be.true;
    expect(url("http://10.1.1.255", {})).to.be.true;
    expect(url("http://224.1.1.1", {})).to.be.true;
    expect(url("http://1.1.1.1.1", {})).to.be.false;
    expect(url("http://123.123.123", {})).to.be.false;
    expect(url("http://3628126748", {})).to.be.false;
    expect(url("http://10.1.1.1", {})).to.be.true;
    expect(url("http://localhost", {})).to.be.true;
    expect(url("http://.www.foo.bar/", {})).to.be.false;
    expect(url("http://www.foo.bar./", {})).to.be.true;
    expect(url("http://.www.foo.bar./", {})).to.be.false;
    expect(url('https://rdap.nic.xn--1ck2e1b/domain/test.xn--1ck2e1b')).to.be.true

    expect(url('https//nedomain7812423.com/echo')).to.be.false
  });
  /*
    it("allows valid urls", function() {
      expect(url("http://foo.com", {})).to.be.true;
      expect(url("http://foo.com/", {})).to.be.true;
      expect(url("http://foo.com/blah_blah", {})).to.be.true;
      expect(url("http://foo.com/blah_blah/", {})).to.be.true;
      expect(url("http://foo.com/blah_blah_(wikipedia)", {})).to.be.true;
      expect(url("http://foo.com/blah_blah_(wikipedia)_(again)", {})).to.be.true;
      expect(url("http://foo.com?query=bar", {})).to.be.true;
      expect(url("http://foo.com#fragment=bar", {})).to.be.true;
      expect(url("http://www.example.com/wpstyle/?p=364", {})).to.be.true;
      expect(url("https://www.example.com/foo/?bar=baz&inga=42&quux", {})).to.be.true;
      expect(url("https://www.example.com/foo/#bar=baz&inga=42&quux", {})).to.be.true;
      expect(url("http://✪df.ws/123", {})).to.be.true;
      expect(url("http://userid:password@example.com:8080", {})).to.be.true;
      expect(url("http://userid:password@example.com:8080/", {})).to.be.true;
      expect(url("http://userid@example.com", {})).to.be.true;
      expect(url("http://userid@example.com/", {})).to.be.true;
      expect(url("http://userid@example.com:8080", {})).to.be.true;
      expect(url("http://userid@example.com:8080/", {})).to.be.true;
      expect(url("http://userid:password@example.com", {})).to.be.true;
      expect(url("http://userid:password@example.com/", {})).to.be.true;
      expect(url("http://142.42.1.1/", {})).to.be.true;
      expect(url("http://142.42.1.1:8080/", {})).to.be.true;
      expect(url("http://➡.ws/䨹", {})).to.be.true;
      expect(url("http://⌘.ws", {})).to.be.true;
      expect(url("http://⌘.ws/", {})).to.be.true;
      expect(url("http://foo.com/blah_(wikipedia)#cite-1", {})).to.be.true;
      expect(url("http://foo.com/blah_(wikipedia)_blah#cite-1", {})).to.be.true;
      expect(url("http://foo.com/unicode_(✪)_in_parens", {})).to.be.true;
      expect(url("http://foo.com/(something)?after=parens", {})).to.be.true;
      expect(url("http://☺.damowmow.com/", {})).to.be.true;
      expect(url("http://code.google.com/events/#&product=browser", {})).to.be.true;
      expect(url("http://j.mp", {})).to.be.true;
      expect(url("http://foo.bar/?q=Test%20URL-encoded%20stuff", {})).to.be.true;
      expect(url("http://مثال.إختبار", {})).to.be.true;
      expect(url("http://例子.测试", {})).to.be.true;
      expect(url("http://उदाहरण.परीक्षा", {})).to.be.true;
      expect(url("http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", {})).to.be.true;
      expect(url("http://1337.net", {})).to.be.true;
      expect(url("http://a.b-c.de", {})).to.be.true;
      expect(url("http://223.255.255.254", {})).to.be.true;
      expect(url("http://a.b--c.de/", {})).to.be.true;
    });
  
    // it("allows local url and private networks if option is set", function() {
    //   expect(url("http://10.1.1.1")).to.be.true;
    //   expect(url("http://172.16.1.123")).to.be.true;
    //   expect(url("http://192.168.1.123")).to.be.true;
    //   expect(url("http://localhost/foo")).to.be.true;
    //   expect(url("http://localhost:4711/foo")).to.be.true;
    //   // Issue #95
    //   expect(url("http://servername01:8153/go/cctray.xml")).to.be.false;
    //   expect(url("http://nicklas:password@localhost:4711/foo")).to.be.false;
    // });
  
    it("not allow data urls", function () {
      //Examples from https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
      expect(url("data:,Hello%2C%20World!")).to.be.false;
      expect(url("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D")).to.be.false;
      expect(url("data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E")).to.be.false;
    });
  
    it("fails data urls without the option", function () {
      //Examples from https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
      expect(url("data:,Hello%2C%20World!")).to.be.false;
      expect(url("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D")).to.be.false;
      expect(url("data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E")).to.be.false;
    })
  
    it("custom schemes", function() {
      var options = {schemes: ['ftp', 'jdbc']};
      expect(url("ftp://foo.bar.com", options)).to.be.true;
      expect(url("jdbc://foo.bar.com", options)).to.be.false;
      expect(url("http://foo.bar.com", options)).to.be.true;
    })
 
*/

  it("tests from data.url.invalid.txt file", async function () {
    var rs = fs.createReadStream(__dirname + '/data.url.invalid.txt')
    rs.on('error', function (err) {
      console.log(err)
      rs.end(err);
    });

    const rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity
    })

    for await (var u of rl) {
      if (u.trim().length === 0) continue
      u = u.replace(/\"/g, '')
      expect(url(u)).to.be.false
    }
  })

  it("tests from data.url.valid.txt file", async function () {
    var rs = fs.createReadStream(__dirname + '/data.url.valid.txt.gz').pipe(zlib.createGunzip())
    rs.on('error', function (err) {
      console.log(err)
      rs.end(err);
    });

    const rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity
    })

    for await (var u of rl) {
      if (u.trim().length === 0) continue
      u = u.replace(/\"/g, '')
      expect(url(u),'url:"'+u+'"').to.be.true
    }
  })

});