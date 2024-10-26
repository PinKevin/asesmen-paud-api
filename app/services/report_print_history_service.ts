import { Document, Packer, Paragraph, TextRun } from 'docx'

export default class ReportPrintHistoryService {
  async printReport() {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun('Halo'),
                new TextRun({
                  text: 'Testing',
                  bold: true,
                }),
                new TextRun({
                  text: '\tAnak anda keren',
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    return buffer
  }
}
