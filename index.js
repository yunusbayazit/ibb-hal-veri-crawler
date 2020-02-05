const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');
const url = 'http://gida.ibb.istanbul/hal-mudurlugu/hal-fiyatlari.html';
const fs = require('fs');
const cheerioTableparser = require('cheerio-tableparser');
const HtmlTableToJson = require('html-table-to-json');

function getData(date){
  var options = {
    method: 'POST',
    uri: url,
    form: {
        // Like <input type="text" name="name">
        tarih: date,
        KategoriId00: '6',
        send00: '1',
        // Like <input type="file" name="file">
    }
};

rp(options)
  .then(function(html){
    const $ = cheerio.load(html);
    const jsonTables = HtmlTableToJson.parse("<table>" + $(".tableClass").html() + "</table>");
    fs.appendFile("files/" + date + "_veri.json", JSON.stringify(jsonTables.results) , function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
  });

}
var startdate = moment().format("YYYY-M-D");
setInterval(() => {
  startdate = moment(startdate, "YYYY-M-D").add(-1, 'days');
  getData(startdate.format("YYYY-M-D"));
}, 100);