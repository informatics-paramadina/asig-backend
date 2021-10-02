const db = require("../config/database");
const ExcelJS = require('exceljs');

const stuff = async (req, res, next) => {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'ASIG Himti Paramadina';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Data Pendaftar');
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Email', key: 'email', width: 32 },
        { header: 'Nomor HP', key: 'phone_number', width: 32 },
        { header: 'Name', key: 'name', width: 32 },
        { header: 'Id Pendaftaran', key: 'id_pendaftaran', width: 32},
        { header: 'Instansi', key: 'instansi', width: 32 },
        { header: 'Pekerjaan', key: 'pekerjaan', width: 32 },
        { header: 'NIM', key: 'nim', width: 10 },
        { header: 'Created At', key: 'created_at', width: 20 },
        { header: 'Updated At', key: 'updated_at', width: 20 }
    ];

    const data = await db('talkshow-rev')
                    .select();

    // const asik = JSON.parse(JSON.stringify(data));
    // console.log(asik);
    worksheet.getRow(1).eachCell({ includeEmpty: true }, function(cell) {
        worksheet.getCell(cell.address)
            .fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '808080' }
            }      
    })

    worksheet.addRows(data);

    worksheet.eachRow(function (Row, rowNum) {
        Row.eachCell(function (Cell, cellNum) {
            if (rowNum == 1) {
                Cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                }
            } else {
                Cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'left'
                }
            }
        })
    })

    // workbook.xlsx.writeFile("daftar.xlsx")
	// 	.then(function() {
	// 		res.send("cool");
	// 	});
    const buffer = await workbook.xlsx.writeBuffer();
    res.status(200).send(buffer);
}

module.exports = {
    stuff
};