import './config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './src/firebase.js';  
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import https from 'https';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


global.access = [];

app.use((req, res, next) => {
    if (!req.cookies.UNEKOSESI) {
        const sessionId = uuidv4().replace(/-/g, '').slice(0, 16); 
        res.cookie('UNEKOSESI', sessionId, { httpOnly: true });
    }
    next();
});

app.get('/login', (req, res) => {
    if (global.access.includes(req.cookies.UNEKOSESI)) {
        res.redirect('/'); 
    } else {
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }
});

app.post('/login/do_login', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        global.access.push(req.cookies.UNEKOSESI); 
        res.redirect('/');
    } else {
        res.redirect('/login'); 
    }
});

app.post('/list', async(req, res) => {
	if (req.body.apikey == global.apikey) {
        let anu = await getListFiles();
        return res.json({ status: 200, messages: "Ok!", result: anu });
    } else {
        res.status(401).json({ status: 401, messages: "Unauthorized", result: null });
    }
	});
	
app.post('/upload', async(req, res) => {
	const { fileBase64, fileName } = req.body;
	if (req.body.apikey == global.apikey) {
		if(!fileBase64 || !fileName) return res.status(401).json({ status: 401, messages: "fileBase64 or fileName can't be empty!", result: null });
        let anu = await uploadFile(Buffer.from(fileBase64, 'base64'), fileName);
        return res.json({ status: 200, messages: "Ok!", result: anu });
    } else {
        res.status(401).json({ status: 401, messages: "Unauthorized", result: null });
    }
	});
	
app.post('/delete', async(req, res) => {
	const { fileName } = req.body;
	if (req.body.apikey == global.apikey) {
		if(!fileName) return res.status(401).json({ status: 401, messages: "fileName can't be empty!", result: null });
        let anu = await deleteFiles(fileName);
        return res.json({ status: 200, messages: "Ok!", result: anu });
    } else {
        res.status(401).json({ status: 401, messages: "Unauthorized", result: null });
    }
	});
	
app.get('/download', async(req, res) => {
	if (global.access.includes(req.cookies.UNEKOSESI)) {
    const { name, contentType, url } = req.query;

    https.get(url, (response) => {
        const data = [];

        response.on('data', (chunk) => {
            data.push(chunk);
        });

        response.on('end', () => {
            const buffer = Buffer.concat(data);

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
            
            res.send(buffer);
        });

    }).on('error', (err) => {
        console.error('Error downloading the file from Firebase:', err);
        res.status(500).send('Error downloading the file');
    });
    } else {
    	res.redirect('/login'); 
    }
	});
	
app.get('/', async(req, res) => {
    if (global.access.includes(req.cookies.UNEKOSESI)) {
        //res.sendFile(path.join(__dirname, 'public/download.html'));
        let files = await getListFiles();
        return res.render('download', { files }); 
    } else {
        res.redirect('/login'); 
    }
});

app.get('/owner', (req, res) => {
	return res.redirect('https://wa.me/'+whatsapp);
	});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
