const { Paragraph, TextRun, patchDocument, TableRow, TableCell, Table, VerticalAlign, HeadingLevel, PatchType, AlignmentType, WidthType, ExternalHyperlink, ImageRun } = require('docx')
const { addRequisiteToLandDebt } = require('./function');
const { territory_title, territory_title_instrumental, phone_number_GU_DPS, website_name, website_url, telegram_name, telegram_url } = require('./constans');
const fs = require('fs').promises

const oneCellWidth = {
    size: 750,
    type: WidthType.PERCENTAGE
}

const addRow = (body) => {
    return body.map((el) => {
        return new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: el?.label, font: "Times New Roman", size: 26, bold: true })
                            ],
                            alignment: AlignmentType.CENTER,
                        })
                    ],
                    width: oneCellWidth,
                    verticalAlign: 'center',
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: el?.value, font: "Times New Roman", size: 26, })
                            ],
                            alignment: AlignmentType.CENTER,
                        })
                    ],
                    width: oneCellWidth,
                    verticalAlign: 'center',
                }),
            ],
        })
    })

};

const createRequisiteWord = async (body, requisite) => {

    try {
        const debts = addRequisiteToLandDebt(body, requisite);
        const docBuffer = await fs.readFile("./files/doc1.docx");
        const children = debts.map((_, index) => [
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({ text: `{{debtText${index}}}`, font: "Times New Roman", size: 26 }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: `{{requisiteText${index}}}`, font: "Times New Roman", size: 26 }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({ text: `{{table${index}}}`, font: "Times New Roman", size: 26 }),
                ],
            }),
        ]).flat();


        const patches = {
            next: {
                type: PatchType.DOCUMENT,
                children,
            },
            name: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: body.name, font: "Times New Roman", size: 26, bold: true })
                        ],
                        alignment: AlignmentType.CENTER
                    })
                ],
            },
            ident: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `і.к. ХХХХХХХ${body.identification}`, font: "Times New Roman", size: 24, bold: true, italics: true })
                        ],
                        alignment: AlignmentType.CENTER
                    })
                ],
            },
            debt_info: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `          ${territory_title} повідомляє, що відповідно до даних ГУ ДПС у Львівській області, станом ${new Intl.DateTimeFormat('uk-UA', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                }).format(new Date(body.date))} у Вас наявна заборгованість до бюджету ${territory_title_instrumental},  а саме:`, font: "Times New Roman", size: 26
                            })
                        ],
                    })
                ],
            },
            gu_dps: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `          В разі виникнення питань по даній заборгованості, звертатись у ГУ ДПС у Львівській області за номером телефона ${phone_number_GU_DPS}.`, font: "Times New Roman", size: 24 })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ],
            },
            sanction_info: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `          Просимо терміново погасити утворену Вами податкову заборгованість до бюджету ${territory_title_instrumental}. Несвоєчасна сплата суми заборгованості призведе до нарахувань штрафних санкцій та пені.`, font: "Times New Roman", size: 24 })
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ],
            },
            footer_info: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `          Перевірити заборгованість можна у застосунках «${website_name}» `, font: "Times New Roman", size: 24 }),
                            new ExternalHyperlink({
                                children: [
                                    new TextRun({
                                        text: website_url,
                                        font: "Times New Roman",
                                        size: 24,
                                        color: "0000FF",
                                        underline: {}
                                    }),
                                ],
                                link: website_url,
                            }),
                            new TextRun({ text: ` та чат - бот в Telegram «${telegram_name}» `, font: "Times New Roman", size: 24 }),
                            new ExternalHyperlink({
                                children: [
                                    new TextRun({
                                        text: telegram_url,
                                        font: "Times New Roman",
                                        size: 24,
                                        color: "0000FF",
                                        underline: {}
                                    }),
                                ],
                                link: telegram_url,
                            }),
                            new TextRun({ text: `, які надають можливість миттєвого отримання актуальної інформації про стан заборгованості по податках і зборах перед бюджетом ${territory_title_instrumental}, реквізити для сплати та можливість оплатити онлайн, або за QR – кодом, який розміщений нижче.`, font: "Times New Roman", size: 24 }),
                        ],
                        alignment: AlignmentType.LEFT
                    })
                ],
            },
            image: {
                type: PatchType.DOCUMENT,
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: await fs.readFile("./files/qr-code.png"),
                                transformation: {
                                    width: 146,
                                    height: 146,
                                },
                            }),
                        ],
                        alignment: AlignmentType.RIGHT
                    })
                ],
            },
        };

        debts.forEach((debt, index) => {
            patches[`debtText${index}`] = {
                type: PatchType.PARAGRAPH,
                children: [
                    new TextRun({
                        text: `${debt[0].debtText}`,
                        font: "Times New Roman",
                        size: 26
                    })
                ],
            };

            patches[`requisiteText${index}`] = {
                type: PatchType.PARAGRAPH,
                children: [
                    new TextRun({
                        text: `${debt[0].requisiteText}`,
                        font: "Times New Roman",
                        bold: true,
                        size: 26
                    })
                ],
            };

            patches[`table${index}`] = {
                type: PatchType.DOCUMENT,
                children: [
                    new Table({
                        rows: addRow(debt[0].table)
                    })
                ],
            };

        });
        const patchedDoc = await patchDocument(docBuffer, { patches });
        return patchedDoc;
    } catch (error) {
        console.error('Error processing document:', error);
        return false;
    }
}



module.exports = {
    createRequisiteWord,
}







