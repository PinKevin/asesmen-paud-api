import {
  AlignmentType,
  Document,
  Footer,
  Header,
  NumberFormat,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx'

export default class ReportPrintHistoryService {
  async printReport() {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              pageNumbers: {
                start: 1,
                formatType: NumberFormat.DECIMAL,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun('Foo Bar corp. '),
                    new TextRun({
                      children: ['Page Number ', PageNumber.CURRENT],
                    }),
                    new TextRun({
                      children: [' to ', PageNumber.TOTAL_PAGES],
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun('Foo Bar corp. '),
                    new TextRun({
                      children: ['Page Number: ', PageNumber.CURRENT],
                    }),
                    new TextRun({
                      children: [' to ', PageNumber.TOTAL_PAGES],
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              children: [new TextRun('Hello World 1'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 2'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 3'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 4'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 5'), new PageBreak()],
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    return buffer
  }
}
