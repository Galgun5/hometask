const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
let app = express();  // server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.text())


app.get('/', (req, res) => {
    // res.send('/index.html')
    res.sendfile('docs' + '/index.html')
})


app.post('/receive', function (req, res) {
    filePath = __dirname + '/data.json';
    dataInput = req.body

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object

            if ( JSON.parse(data)["markers"] === undefined){
                Object.assign(obj, dataInput);
            }else{
                markers = obj["markers"]
                dataOfDashbord = obj["dataOfDashbord"]
                Object.assign(markers, dataInput["markers"]);
                Object.assign(dataOfDashbord, dataInput["dataOfDashbord"]);
                obj = {markers, dataOfDashbord}
            }

            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(filePath, json, 'utf8', function(err) {
                if (err) throw err;
                console.log('complete');
            }); // write it back

            res.sendStatus(200)
        }});
});


app.delete('/receive', (req, res) => {
    numMarker = req.body;
    filePath = __dirname + '/data.json';
    // console.log(req)

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object

            delete obj.dataOfDashbord[`number_#${numMarker}`]
            delete obj.markers[`marker_#${numMarker}`]

            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(filePath, json, 'utf8', function(err) {
                if (err) throw err;
                console.log('complete');
            }); // write it back

            res.sendStatus(200)
        }});
})


app.get('/download', (req, res) => {
    let file = __dirname + '/data.json';
    res.download(file)
})

app.get('/xx', (req, res) => {
    res.send('fdgdfgdgdgdg')

})

app.use(express.static(__dirname + '/docs'));

app.listen(3333, () => console.log('API started'));
// nodemon ./server.js localhost 3333




