import {
  AlignmentType,
  BorderStyle,
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
  WidthType,
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
import StudentService from './student_service.js'
import { DateTime } from 'luxon'
import ReportInfoService from './report_info_service.js'
import User from '#models/user'
import TeacherService from './teacher_service.js'

@inject()
export default class ReportPrintHistoryService {
  constructor(
    private teacherService: TeacherService,
    private reportInfoService: ReportInfoService,
    private studentService: StudentService,
    private anecdotalService: AnecdotalAssessmentService,
    private artworkService: ArtworkAssessmentService,
    private checklistService: ChecklistAssessmentService,
    private seriesPhotoService: SeriesPhotoAssessmentService
  ) {}

  async createInfoTable(student: {
    name: string
    nisn: string
    gender: string
    religion: string
    className: string
    photoProfileLink: string
  }) {
    // const imageData = await drive.use().getBytes(student.photoProfileLink)

    const imageAndNameRow = new TableRow({
      children: [
        // new TableCell({
        //   rowSpan: 5,
        //   verticalAlign: AlignmentType.CENTER,
        //   children: [
        //     new Paragraph({
        //       alignment: AlignmentType.CENTER,
        //       children: [
        //         new ImageRun({
        //           data: imageData,
        //           transformation: { width: 113, height: 151 },
        //           type: 'jpg',
        //         }),
        //       ],
        //     }),
        //   ],
        // }),
        new TableCell({
          verticalAlign: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              tabStops: [
                {
                  position: 1500,
                  type: 'left',
                },
              ],
              children: [
                new TextRun({ text: `Nama\t: ${student.name}`, bold: true, size: '12pt' }),
              ],
            }),
          ],
        }),
      ],
    })

    const nisnRow = new TableRow({
      children: [
        new TableCell({
          verticalAlign: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              tabStops: [
                {
                  position: 1500,
                  type: 'left',
                },
              ],
              children: [
                new TextRun({ text: `NISN\t: ${student.nisn}`, bold: true, size: '12pt' }),
              ],
            }),
          ],
        }),
      ],
    })

    const classRow = new TableRow({
      children: [
        new TableCell({
          verticalAlign: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              tabStops: [
                {
                  position: 1500,
                  type: 'left',
                },
              ],
              children: [
                new TextRun({ text: `Kelas\t: ${student.className}`, bold: true, size: '12pt' }),
              ],
            }),
          ],
        }),
      ],
    })

    const genderRow = new TableRow({
      children: [
        new TableCell({
          verticalAlign: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              tabStops: [
                {
                  position: 1500,
                  type: 'left',
                },
              ],
              children: [
                new TextRun({
                  text: `Jenis Kelamin\t: ${student.gender}`,
                  bold: true,
                  size: '12pt',
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const religionRow = new TableRow({
      children: [
        new TableCell({
          verticalAlign: AlignmentType.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              tabStops: [
                {
                  position: 1500,
                  type: 'left',
                },
              ],
              children: [
                new TextRun({
                  text: `Agama\t: ${student.religion}`,
                  bold: true,
                  size: '12pt',
                }),
              ],
            }),
          ],
        }),
      ],
    })

    return new Table({
      rows: [imageAndNameRow, nisnRow, classRow, genderRow, religionRow],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      alignment: 'center',
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
      },
    })
  }

  async createAnecdotalTable(anecdotals: AnecdotalAssessment[]) {
    if (anecdotals.length > 0) {
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
    } else {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Belum ada asesmen anekdot', size: '12pt' })],
      })
    }
  }

  async createArtworkTable(artworks: ArtworkAssessment[]) {
    if (artworks.length > 0) {
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
    } else {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Belum ada asesmen hasil karya', size: '12pt' })],
      })
    }
  }

  createChecklistTable(checklists: ChecklistAssessment[]) {
    if (checklists.length > 0) {
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
                  children: [
                    new TextRun({ text: 'Capaian Pembelajaran', size: '12pt', bold: true }),
                  ],
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
    } else {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Belum ada asesmen ceklis', size: '12pt' })],
      })
    }
  }

  async createSeriesPhotoTable(seriesPhotos: SeriesPhotoAssessment[]) {
    if (seriesPhotos.length > 0) {
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
    } else {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Belum ada asesmen foto berseri', size: '12pt' })],
      })
    }
  }

  createSignatureTable(signatureDate: string, teacherName: string, className: string) {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('')],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `Semarang, ${signatureDate}`, bold: true, size: '12pt' }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: 'Orang Tua/Wali Murid', size: '12pt' })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `Wali Kelas ${className}`, size: '12pt' })],
                }),
              ],
            }),
          ],
        }),
        ...[2, 3, 4, 5, 6].map(
          () =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('')],
                }),
                new TableCell({
                  children: [new Paragraph('')],
                }),
              ],
            })
        ),
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [new TextRun({ text: '........................', size: '12pt' })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `${teacherName}`, size: '12pt' })],
                }),
              ],
            }),
          ],
        }),
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
      },
    })
  }

  async printReport(
    studentId: number,
    user: User,
    startDate = DateTime.now().startOf('month').toFormat('yyyy-LL-dd'),
    endDate = DateTime.now().endOf('month').toFormat('yyyy-LL-dd')
  ) {
    const [teacher, schoolSemester, student, anecdotals, artworks, checklists, seriesPhotos] =
      await Promise.all([
        this.teacherService.getTeacherInfo(user),
        this.reportInfoService.getSemesterInfo(),
        this.studentService.getStudentInfo(studentId),
        this.anecdotalService.getAllAssessments(studentId, {
          usePagination: false,
          sortOrder: 'asc',
          startDate: startDate,
          endDate: endDate,
        }),
        this.artworkService.getAllAssessments(studentId, {
          usePagination: false,
          sortOrder: 'asc',
          startDate: startDate,
          endDate: endDate,
        }),
        this.checklistService.getAllAssessments(studentId, {
          usePagination: false,
          sortOrder: 'asc',
          startDate: startDate,
          endDate: endDate,
        }),
        this.seriesPhotoService.getAllAssessments(studentId, {
          usePagination: false,
          sortOrder: 'asc',
          startDate: startDate,
          endDate: endDate,
        }),
      ])

    const formattedStartDate = DateTime.fromFormat(startDate, 'yyyy-LL-dd')
      .setLocale('id-ID')
      .toFormat('d LLLL yyyy')
    const formattedEndDate = DateTime.fromFormat(endDate, 'yyyy-LL-dd')
      .setLocale('id-ID')
      .toFormat('d LLLL yyyy')
    const titleDate = DateTime.fromFormat(startDate, 'yyyy-LL-dd')
      .setLocale('id-Id')
      .toFormat('LLL_yyyy')

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
                    new TextRun({ text: 'PAUD Ainun Habibie', size: '12pt' }),
                    new TextRun({
                      size: '12pt',
                      children: [
                        ' - Semester ',
                        schoolSemester.isEvenSemester ? 'Genap' : 'Ganjil',
                        ` Tahun Ajaran ${schoolSemester.startYear}/${schoolSemester.endYear}`,
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
                      text: 'PAUD Ainun Habibie | Laporan dicetak secara otomatis',
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
              children: [
                new TextRun({
                  text: 'Laporan Pembelajaran Periodik Siswa',
                  bold: true,
                  size: '14pt',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Rentang', size: '14pt', bold: true }),
                new TextRun({
                  size: '14pt',
                  bold: true,
                  children: [` ${formattedStartDate} hingga ${formattedEndDate}`],
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            await this.createInfoTable(student),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
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
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            new Paragraph({
              children: [new TextRun('\n')],
            }),
            this.createSignatureTable(formattedEndDate, teacher!.name, student.className),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    return { student, buffer, formattedEndDate, titleDate }
  }
}
