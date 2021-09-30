const { PDFDocument, StandardFonts, rgb, degrees, PageSizes } = require("pdf-lib");
const fontkit = require('@pdf-lib/fontkit');
const axios = require('axios');
const fs = require('fs');
const db = require("../config/database");

const createPdf = async () => {
    const pdfDoc = await PDFDocument.create();
	const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

	const page = pdfDoc.addPage(PageSizes.A4);
	const { width, height } = page.getSize();
	const fontSize = 30;

	page.drawText('Hello World', {
		x: 40,
		y: 50,
		size: fontSize,
		font: timesRomanFont,
		color: rgb(0, 0.53, 0.71),
	});

    page.setRotation(degrees(90));

    pdfDoc.setTitle('e-certificate Talkshow ASIG-14');
    pdfDoc.setProducer('ASIG by HIMTI Universitas Paramadina');
    pdfDoc.setCreationDate(new Date());

	const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

	return pdfBuffer;
}

// async function base64ToFile(dataURL, fileName) {
//     const arr = dataURL.split(',');
//     const mime = arr[0].match(/:(.*?);/)[1];
//     return (fetch(dataURL)
//         .then(function (result) {
//             return result.arrayBuffer();
//         }));
// }

const createPdfFromImg = async (name) => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();

    const img = fs.readFileSync('./logohimti_2.png');
    const pngImage = await pdfDoc.embedPng(img);

    const { width, height } = pngImage.scale(1);
    page.drawImage(pngImage, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2
    });

    page.setRotation(degrees(90));

    const { width: textWidth, height: textHeight } = page.getSize();
    // console.log(page.getWidth(), page.getHeight());
    page.drawText(name, {
		x: textWidth / 2 + 50,
        y: textHeight / 3,
		size: 50,
		font: timesRomanFont,
		color: rgb(0, 0.53, 0.71),
        rotate: degrees(90)
	});

    pdfDoc.setTitle('e-certificate Talkshow ASIG-14');
    pdfDoc.setProducer('ASIG by HIMTI Universitas Paramadina');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

	return pdfBuffer;
}

const createPdfFromPdf = async (name) => {
    const cert = fs.readFileSync('./cert.pdf');
    const pdfDoc = await PDFDocument.load(cert);
    pdfDoc.registerFontkit(fontkit);
    const timesRomanFont = await pdfDoc.embedFont(fs.readFileSync("./Roboto-Regular.ttf"), { subset: true });

    const pages = pdfDoc.getPages();

    const {
        width,
        height
    } = pages[0].getSize()
    
    pages[0].drawText(name, {
		x: width/15,
        y: height/1.95,
		size: 36,
		font: timesRomanFont,
		color: rgb(1, 1, 1)
	});

    pdfDoc.setTitle(`e-certificate ${name} - Talkshow ASIG-14`);
    pdfDoc.setProducer('ASIG by HIMTI Universitas Paramadina');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

	return pdfBuffer;
}

const sendPdf = async (req, res, next) => {
    if (!req.body.id_pendaftaran) return res.status(406).json({status: "request not accepted!"})
    let nameGet = await db("talkshow-rev").select("name").where({ id_pendaftaran: req.body.id_pendaftaran }).first();
    nameGet = nameGet.name;
    
    if (!nameGet) return res.status(400).json({status: "user not found"}); 
    createPdfFromPdf(nameGet)
        .then(pdfBuffer => {
            res.status(200).type('pdf').send(pdfBuffer);
	    })
        .catch(error => next(error));
}

module.exports = sendPdf;