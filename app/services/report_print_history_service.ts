import {
  AlignmentType,
  Document,
  Footer,
  Header,
  ImageRun,
  NumberFormat,
  Packer,
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
import ChecklistAssessment from '#models/checklist_assessment'
import SeriesPhotoAssessment from '#models/series_photo_assessment'

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
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Deskripsi:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: anecdotal.description, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const feedbackRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Umpan Balik:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: anecdotal.feedback, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const learningGoalsRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran:', size: '12pt', bold: true }),
                  ],
                }),
                ...anecdotal.learningGoals.map(
                  (goal) =>
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
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
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Deskripsi:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: artwork.description, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const feedbackRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Umpan Balik:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: artwork.feedback, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const learningGoalsRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran:', size: '12pt', bold: true }),
                  ],
                }),
                ...artwork.learningGoals.map(
                  (goal) =>
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
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

  createChecklistTable(checklists: ChecklistAssessment[]) {
    const rows = checklists.map((checklist) => {
      const dateRow = new TableRow({
        children: [
          new TableCell({
            columnSpan: 6,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Penilaian tanggal: ${checklist.createdAt.plus({ hours: 7 }).setLocale('id-ID').toFormat("dd LLLL yyyy 'pukul' HH:mm 'WIB'")}`,
                    size: '12pt',
                  }),
                ],
              }),
            ],
          }),
        ],
      })

      const headerRow = new TableRow({
        children: [
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'No.', size: '12pt', bold: true })],
              }),
            ],
          }),
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Konteks', size: '12pt', bold: true })],
              }),
            ],
          }),
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Kejadian yang Teramati', size: '12pt', bold: true }),
                ],
              }),
            ],
          }),
          new TableCell({
            columnSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Hasil Pengamatan', size: '12pt', bold: true })],
              }),
            ],
          }),
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Capaian Pembelajaran', size: '12pt', bold: true })],
              }),
            ],
          }),
        ],
      })

      const observatonResultRow = new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Belum Muncul', size: '12pt', bold: true })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Sudah Muncul', size: '12pt', bold: true })],
              }),
            ],
          }),
        ],
      })

      const checklistPointRow = checklist.checklistPoints.map(
        (point, index) =>
          new TableRow({
            children: [
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${index + 1}`,
                        size: '12pt',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                      new TextRun({
                        text: point.context,
                        size: '12pt',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                      new TextRun({
                        text: point.observedEvent,
                        size: '12pt',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: !point.hasAppeared ? '\u2713' : '',
                        size: '16pt',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: point.hasAppeared ? '\u2713' : '',
                        size: '16pt',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                      new TextRun({
                        text: `${point.learningGoal.learningGoalCode} - ${point.learningGoal.learningGoalName}`,
                        size: '12pt',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      )

      return [dateRow, headerRow, observatonResultRow, ...checklistPointRow]
    })

    const flattenedRows = rows.flat()

    return new Table({
      rows: flattenedRows,
    })
  }

  async createSeriesPhotoTable(seriesPhotos: SeriesPhotoAssessment[]) {
    const rows = await Promise.all(
      seriesPhotos.map(async (seriesPhoto) => {
        const dateRow = new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Penilaian tanggal: ${seriesPhoto.createdAt.plus({ hours: 7 }).setLocale('id-ID').toFormat("dd LLLL yyyy 'pukul' HH:mm 'WIB'")}`,
                      size: '12pt',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })

        const imageRuns = await Promise.all(
          seriesPhoto.seriesPhotos.map(async (photo) => {
            const imageData = await drive.use().getBytes(photo.photoLink)
            return new ImageRun({
              data: imageData,
              transformation: { width: 151, height: 151 },
              type: 'jpg',
            })
          })
        )

        const imagesRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: imageRuns,
                }),
              ],
            }),
          ],
        })

        const descriptionRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Deskripsi:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: seriesPhoto.description, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const feedbackRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: 'Umpan Balik:', size: '12pt', bold: true })],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [new TextRun({ text: seriesPhoto.feedback, size: '12pt' })],
                }),
              ],
            }),
          ],
        })

        const learningGoalsRow = new TableRow({
          children: [
            new TableCell({
              verticalAlign: AlignmentType.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran:', size: '12pt', bold: true }),
                  ],
                }),
                ...seriesPhoto.learningGoals.map(
                  (goal) =>
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
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

        return [dateRow, imagesRow, descriptionRow, feedbackRow, learningGoalsRow]
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
        sortOrder: 'asc',
      }),
      this.artworkService.getAllAssessments(studentId, {
        usePagination: false,
        sortOrder: 'asc',
      }),
      this.checklistService.getAllAssessments(studentId, {
        usePagination: false,
        sortOrder: 'asc',
      }),
      this.seriesPhotoService.getAllAssessments(studentId, {
        usePagination: false,
        sortOrder: 'asc',
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
                      text: 'PAUD AINUN HABIBIE | Laporan dicetak secara otomatis',
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
              children: [new TextRun('\n')],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Asesmen Ceklis', bold: true, size: '12pt' })],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            this.createChecklistTable(checklists),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Asesmen Foto Berseri', bold: true, size: '12pt' })],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            await this.createSeriesPhotoTable(seriesPhotos),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    return buffer
  }
}
