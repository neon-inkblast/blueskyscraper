import express from 'express';
import fileUpload from 'express-fileupload';
import { scrape } from "./scrape";
import path from 'path';

const app = express();
const port = 3000;

app.use(fileUpload());
app.use('/static', express.static(__dirname+ '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.post('/upload', function(req, res) {
    let sampleFile: any;
    let uploadPath: string;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files?.csvFile;
    console.log(sampleFile.data.toString('utf8')); // Log file content as UTF-8 string
    uploadPath = `${__dirname}/input/input.csv`;

    // Use the mv() method to place the file somewhere on your server
    if (sampleFile) {
        sampleFile.mv(uploadPath, function(err: any) {
            if (err)
                return res.status(500).send(err);
            else {
                res.send('File uploaded!');
                scrape();
            }
        });
    } else {
        res.status(400).send('No file uploaded');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
