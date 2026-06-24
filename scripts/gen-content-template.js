/* Generates "Race Guide Content Template.docx" — a fillable intake form for the
   Vacation Races team. Run: NODE_PATH=$(npm root -g) node scripts/gen-content-template.js
   Regenerate any time the content model changes. */
const fs = require('fs')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak,
} = require('docx')

const DXA = WidthType.DXA
const CONTENT = 9360
const FOREST = '264533'
const CREAMFILL = 'F6F1E8'
const HEADERFILL = 'E7DECF'
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCBFA8' }
const borders = { top: border, bottom: border, left: border, right: border }
const cellMargins = { top: 70, bottom: 70, left: 110, right: 110 }

function t(text, opts = {}) { return new TextRun({ text, ...opts }) }
function p(text, opts = {}) { return new Paragraph({ children: text ? [t(text, opts)] : [], ...(opts.para || {}) }) }
function blank() { return new Paragraph({ children: [] }) }

function cell(children, width, fill) {
  return new TableCell({
    width: { size: width, type: DXA }, borders, margins: cellMargins,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    children,
  })
}

// Two-column "Field | Your content" table.
function fields(rows) {
  return new Table({
    width: { size: CONTENT, type: DXA }, columnWidths: [3260, 6100],
    rows: rows.map(([label, guidance]) => new TableRow({
      children: [
        cell([
          new Paragraph({ children: [t(label, { bold: true })] }),
          ...(guidance ? [new Paragraph({ children: [t(guidance, { italics: true, size: 17, color: '777777' })] })] : []),
        ], 3260),
        cell([blank()], 6100, CREAMFILL),
      ],
    })),
  })
}

// Repeatable list table: header row + N blank rows.
function listTable(headers, widths, blankRows = 4) {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => cell([new Paragraph({ children: [t(h, { bold: true, size: 19 })] })], widths[i], HEADERFILL)),
    }),
  ]
  for (let r = 0; r < blankRows; r++) {
    rows.push(new TableRow({ children: headers.map((_, i) => cell([blank()], widths[i], CREAMFILL)) }))
  }
  return new Table({ width: { size: CONTENT, type: DXA }, columnWidths: widths, rows })
}

const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] })
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] })
const note = (text) => new Paragraph({ spacing: { before: 60, after: 160 }, children: [t(text, { italics: true, size: 18, color: '777777' })] })
const space = () => new Paragraph({ spacing: { after: 120 }, children: [] })
const repeat = (what) => note(`↻ Repeatable — add a row per ${what} (or tell us and we’ll add them).`)
const optional = ' (optional)'

const children = []

// ---- Title ----
children.push(new Paragraph({ spacing: { after: 60 }, children: [t('Vacation Races', { bold: true, size: 28, color: FOREST })] }))
children.push(new Paragraph({ spacing: { after: 120 }, children: [t('Race Day Guide — Content Template', { bold: true, size: 44, color: FOREST })] }))
children.push(p('Fill in the sections below for your event. Everything here drops straight into the digital Race Day Guide — one section of the template = one section of the guide. Leave any field blank if it doesn’t apply; mark a whole section "skip" if the event doesn’t have it.', { size: 22 }))
children.push(space())
children.push(p('How it works', { bold: true, size: 24, color: FOREST }))
children.push(new Paragraph({ numbering: { reference: 'nums', level: 0 }, children: [t('Type your content in the shaded boxes. Keep it final — this is the live wording runners will read.')] }))
children.push(new Paragraph({ numbering: { reference: 'nums', level: 0 }, children: [t('For lists (schedule rows, FAQs, hikes, etc.), use the table rows provided and add more as needed.')] }))
children.push(new Paragraph({ numbering: { reference: 'nums', level: 0 }, children: [t('Send any photos / logos / route links separately — note the file name or paste the URL in the relevant box.')] }))
children.push(new Paragraph({ numbering: { reference: 'nums', level: 0 }, children: [t('Once returned, we load it into the guide; the VR team can then fine-tune any text live at the /edit editor.')] }))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 1. Event basics ----
children.push(H1('1 · Event basics'))
children.push(fields([
  ['Event name', 'The big hero title, e.g. "Rocky Mountain".'],
  ['Tagline', 'Short line under the title, e.g. "Half Marathon • 5K".'],
  ['Dates', 'e.g. "July 31 – August 1, 2026".'],
  ['Location', 'Town & state, e.g. "Estes Park, Colorado".'],
  ['Hero photo', 'Attach a high-res landscape photo or paste an image URL. (Locked image — set by us.)'],
  ['Event shield / logo' + optional, 'Attach the event badge PNG (shows top-right of the hero).'],
]))
children.push(space())

// ---- 2. Welcome ----
children.push(H1('2 · Welcome' + optional))
children.push(note('A warm intro message. Skip the whole section if not needed.'))
children.push(fields([
  ['Heading', 'e.g. "Welcome to the Rockies!" (the last word is styled large).'],
  ['Body', 'Opening paragraph(s).'],
  ['Quote' + optional, 'A short quote, e.g. a John Muir line.'],
  ['Quote attribution' + optional, 'Who said it.'],
  ['Closing' + optional, 'Sign-off paragraph(s).'],
  ['Note to runners' + optional, 'The "subject to change" disclaimer, etc.'],
]))
children.push(space())

// ---- 3. Schedule ----
children.push(H1('3 · Schedule'))
children.push(note('Group by day. Each day is a tab on the guide.'))
children.push(H2('Day 1'))
children.push(fields([['Day label', 'e.g. "Friday / 5K".'], ['Date', 'e.g. "July 31, 2026".']]))
children.push(space())
children.push(listTable(['Time', 'What happens', 'Note (optional)'], [1900, 4060, 3400], 6))
children.push(repeat('schedule item'))
children.push(H2('Day 2'))
children.push(fields([['Day label', 'e.g. "Saturday / Half Marathon".'], ['Date', 'e.g. "August 1, 2026".']]))
children.push(space())
children.push(listTable(['Time', 'What happens', 'Note (optional)'], [1900, 4060, 3400], 8))
children.push(repeat('schedule item'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 4. Expo ----
children.push(H1('4 · Expo'))
children.push(fields([
  ['Date', 'e.g. "Friday, July 31, 2026".'],
  ['Location name', 'e.g. "Stanley Park Ball Field".'],
  ['Address', 'Full street address.'],
  ['Google Maps link', 'Paste the maps URL.'],
  ['Map image URL' + optional, 'A static map/expo image, if you have one.'],
]))
children.push(space())
children.push(p('Hours', { bold: true }))
children.push(listTable(['Label', 'Time'], [3760, 5600], 4))
children.push(repeat('hours row'))
children.push(p('Quick "good to know" notes', { bold: true }))
children.push(listTable(['Note'], [9360], 4))
children.push(repeat('note'))
children.push(p('Info blocks (BYOB, Merch, Volunteers, …)', { bold: true }))
children.push(listTable(['Heading', 'Body', 'Link label + URL (optional)'], [2300, 4660, 2400], 4))
children.push(repeat('info block'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 5. 5K info ----
children.push(H1('5 · Rocky Mountain 5K Info'))
children.push(note('The shorter race. (Rendered as the "Course Info" / 5K section.)'))
children.push(fields([
  ['Section heading', 'e.g. "5K Info".'],
  ['Nav label', 'Short label for the top nav, e.g. "5K Info".'],
  ['Course name', 'e.g. "5K Course".'],
  ['RideWithGPS route link', 'The route URL (we turn it into the live map embed).'],
  ['Stats line' + optional, 'Fallback text, e.g. "3.1 mi · +156 ft / -168 ft · Paved loop".'],
]))
children.push(p('Stat tiles (the big numbers)', { bold: true }))
children.push(listTable(['Value', 'Label'], [3000, 6360], 4))
children.push(note('e.g. Value "3.1" / Label "Miles"; Value "6:00 PM" / Label "Friday Start".'))
children.push(p('Detail sections (accordions: bib pickup, parking, aid stations, awards, …)', { bold: true }))
children.push(listTable(['Heading', 'Body'], [2600, 6760], 6))
children.push(repeat('detail section'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 6. Half marathon / race morning ----
children.push(H1('6 · Half Marathon — Race Morning'))
children.push(fields([
  ['Nav label', 'e.g. "Half Marathon Info".'],
  ['Morning schedule label' + optional, 'e.g. "Morning Schedule".'],
  ['Course name', 'e.g. "Half Marathon Course".'],
  ['RideWithGPS route link', 'The route URL.'],
  ['Stats line' + optional, 'e.g. "13.1 mi · +780 ft / -775 ft · Paved road loop".'],
]))
children.push(p('Stat tiles', { bold: true }))
children.push(listTable(['Value', 'Label'], [3000, 6360], 4))
children.push(p('Morning schedule', { bold: true }))
children.push(listTable(['Time', 'What happens'], [2400, 6960], 5))
children.push(p('Parking lots', { bold: true }))
children.push(listTable(['Lot name', 'Details / directions', 'Google Maps link'], [2300, 4660, 2400], 3))
children.push(repeat('parking lot'))
children.push(fields([
  ['Parking map image URL' + optional, 'A static parking map, if available.'],
  ['Drop-off note', 'Instructions for dropping a runner off.'],
]))
children.push(p('Detail sections (course details, elevation, pacers, gear check, aid, cup-free, …)', { bold: true }))
children.push(listTable(['Heading', 'Body'], [2600, 6760], 8))
children.push(repeat('detail section'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 7. Spectators ----
children.push(H1('7 · Spectators'))
children.push(fields([
  ['Intro', 'Opening paragraph for spectators.'],
  ['Shuttle access' + optional, 'Shuttle / access details, if any.'],
]))
children.push(p('Numbered points (rendered as 01, 02, 03 … cards)', { bold: true }))
children.push(listTable(['Point'], [9360], 4))
children.push(repeat('point'))
children.push(space())

// ---- 8. Post-race ----
children.push(H1('8 · Post-Race'))
children.push(fields([['Finish line info', 'Overview paragraph for the finish area / recovery.']]))
children.push(p('Course records', { bold: true }))
children.push(listTable(['Category', 'Name', 'Time', 'Year'], [3000, 3360, 1700, 1300], 4))
children.push(repeat('record'))
children.push(p('Detail sections (medals & awards, live tracking, results & photos, iTab, lost & found, …)', { bold: true }))
children.push(listTable(['Heading', 'Body', 'Link buttons (label + URL, optional)'], [2300, 4660, 2400], 6))
children.push(repeat('detail section'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 9. Challenge event ----
children.push(H1('9 · Challenge Event — e.g. Elk Double' + optional))
children.push(note('Skip if the event has no challenge/combo. Add a block per challenge event.'))
children.push(fields([
  ['Name', 'e.g. "Elk Double".'],
  ['Tagline' + optional, 'e.g. "5K + Half Marathon · July 31 – August 1, 2026".'],
  ['Description', 'What it is, what finishers get.'],
  ['Bib pickup', 'Where/when to collect the bib.'],
  ['Medals', 'How/where the special medal is collected.'],
  ['Swag' + optional, 'Swag item details.'],
]))
children.push(p('Stat tiles', { bold: true }))
children.push(listTable(['Value', 'Label'], [3000, 6360], 3))
children.push(note('e.g. "16.2" / "Total Miles"; "3" / "Medals"; "1" / "Bib · Both Races".'))
children.push(p('What’s included', { bold: true }))
children.push(listTable(['Included item'], [9360], 4))
children.push(repeat('included item'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 10. Experiences ----
children.push(H1('10 · Experiences'))
children.push(H2('Lodging'))
children.push(fields([
  ['Partner', 'e.g. "HotelPlanner".'],
  ['Description', 'Lodging blurb.'],
  ['Booking URL', 'Link.'],
  ['Photo URL' + optional, 'Lodging image.'],
]))
children.push(H2('Activities / partners to feature'))
children.push(listTable(['Name', 'Description', 'Discount code (opt)', 'URL'], [2200, 3760, 1600, 1800], 4))
children.push(repeat('activity'))
children.push(H2('Hikes'))
children.push(listTable(['Name', 'Distance', 'Elevation', 'Difficulty', 'URL / photo (opt)'], [2200, 1500, 1500, 1600, 2560], 5))
children.push(repeat('hike'))
children.push(H2('Iconic views & sights'))
children.push(listTable(['Name', 'Description', 'URL (optional)'], [2300, 4660, 2400], 5))
children.push(repeat('sight'))
children.push(H2('Know-before-you-go note' + optional))
children.push(fields([['Park note', 'Park pass / timed-entry reminder, etc.']]))
children.push(H2('Restaurants'))
children.push(listTable(['Emoji', 'Name', 'Address', 'Phone', 'Website', 'Description'], [800, 1900, 2200, 1500, 1500, 1460], 5))
children.push(repeat('restaurant'))
children.push(new Paragraph({ children: [new PageBreak()] }))

// ---- 11. FAQs ----
children.push(H1('11 · FAQs'))
children.push(listTable(['Question', 'Answer'], [3400, 5960], 10))
children.push(repeat('FAQ'))
children.push(space())

// ---- 12. Partners ----
children.push(H1('12 · Partners & Sponsors'))
children.push(note('List every partner/sponsor name to show in the "Our Partners" wall.'))
children.push(listTable(['Partner / sponsor name'], [9360], 8))
children.push(repeat('partner'))

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, color: FOREST, font: 'Arial' },
        paragraph: { spacing: { before: 260, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '3C5A45', font: 'Arial' },
        paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{ reference: 'nums', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 620, hanging: 320 } } } }] }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1440, bottom: 1200, left: 1440 } } },
    children,
  }],
})

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('Race Guide Content Template.docx', buf)
  console.log('wrote Race Guide Content Template.docx', buf.length, 'bytes')
})
