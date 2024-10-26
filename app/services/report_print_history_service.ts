import {
  AlignmentType,
  Document,
  Footer,
  Header,
  ImageRun,
  NumberFormat,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx'
import AnecdotalAssessmentService from './anecdotal_assessment_service.js'
import { inject } from '@adonisjs/core'
import ArtworkAssessmentService from './artwork_assessment_service.js'
import ChecklistAssessmentService from './checklist_assessment_service.js'
import SeriesPhotoAssessmentService from './series_photo_assessment_service.js'
import AnecdotalAssessment from '#models/anecdotal_assessment'
import drive from '@adonisjs/drive/services/main'
import ArtworkAssessment from '#models/artwork_assessment'

@inject()
export default class ReportPrintHistoryService {
  constructor(
    private anecdotalService: AnecdotalAssessmentService,
    private artworkService: ArtworkAssessmentService,
    private checklistService: ChecklistAssessmentService,
    private seriesPhotoService: SeriesPhotoAssessmentService
  ) {}

  async createAnecdotalTable(anecdotals: AnecdotalAssessment[]) {
    const rows = await Promise.all(
      anecdotals.map(async (anecdotal) => {
        const imageData = await drive.use().getBytes(anecdotal.photoLink)

        const dateRow = new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Penilaian tanggal: ${anecdotal.createdAt.plus({ hours: 7 }).setLocale('id-ID').toFormat("dd LLLL yyyy 'pukul' HH:mm 'WIB'")}`,
                      size: '12pt',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })

        const imageRow = new TableRow({
          children: [
            new TableCell({
              rowSpan: 3,
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: imageData,
                      transformation: { width: 151, height: 151 },
                      type: 'jpg',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Deskripsi:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: anecdotal.description, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const feedbackRow = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Umpan Balik:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: anecdotal.feedback, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const learningGoalsRow = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran:', size: '12pt', bold: true }),
                  ],
                }),
                ...anecdotal.learningGoals.map(
                  (goal) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${goal.learningGoalCode} - ${goal.learningGoalName}`,
                          size: '12pt',
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        })

        return [dateRow, imageRow, feedbackRow, learningGoalsRow]
      })
    )

    const flattenedRows = rows.flat()

    return new Table({
      rows: flattenedRows,
    })
  }

  async createArtworkTable(artworks: ArtworkAssessment[]) {
    const rows = await Promise.all(
      artworks.map(async (artwork) => {
        const imageData = await drive.use().getBytes(artwork.photoLink)

        const dateRow = new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Penilaian tanggal: ${artwork.createdAt.plus({ hours: 7 }).setLocale('id-ID').toFormat("dd LLLL yyyy 'pukul' HH:mm 'WIB'")}`,
                      size: '12pt',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })

        const imageRow = new TableRow({
          children: [
            new TableCell({
              rowSpan: 3,
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: imageData,
                      transformation: { width: 151, height: 151 },
                      type: 'jpg',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Deskripsi:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: artwork.description, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const feedbackRow = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Umpan Balik:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: artwork.feedback, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const learningGoalsRow = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran:', size: '12pt', bold: true }),
                  ],
                }),
                ...artwork.learningGoals.map(
                  (goal) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${goal.learningGoalCode} - ${goal.learningGoalName}`,
                          size: '12pt',
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        })

        return [dateRow, imageRow, feedbackRow, learningGoalsRow]
      })
    )

    const flattenedRows = rows.flat()

    return new Table({
      rows: flattenedRows,
    })
  }

  async printReport(studentId: number) {
    const [anecdotals, artworks, checklists, seriesPhotos] = await Promise.all([
      this.anecdotalService.getAllAssessments(studentId, {
        usePagination: false,
      }),
      this.artworkService.getAllAssessments(studentId, {
        usePagination: false,
      }),
      this.checklistService.getAllAssessments(studentId, {
        usePagination: false,
      }),
      this.seriesPhotoService.getAllAssessments(studentId, {
        usePagination: false,
      }),
    ])

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
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'LAPORAN PENILAIAN PAUD', size: '12pt' }),
                    new TextRun({
                      size: '12pt',
                      children: [
                        ' - Halaman ',
                        PageNumber.CURRENT,
                        ' dari ',
                        PageNumber.TOTAL_PAGES,
                      ],
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
                    new TextRun({
                      text: 'PAUD KEVIN | Laporan dicetak secara otomatis',
                      size: '12pt',
                    }),
                    new TextRun({
                      size: '12pt',
                      children: [
                        ' - Halaman ',
                        PageNumber.CURRENT,
                        ' dari ',
                        PageNumber.TOTAL_PAGES,
                      ],
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Asesmen Anekdot', bold: true, size: '12pt' })],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            await this.createAnecdotalTable(anecdotals),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Asesmen Hasil Karya', bold: true, size: '12pt' })],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            await this.createArtworkTable(artworks),
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
