/* ==========================================================================
   MASHINUX — קובץ תוכן מרכזי (עברית)
   כל הנתונים העובדתיים, הרשימות ופרטי התעודה נמצאים כאן בלבד.
   גרסה אנגלית עתידית: content.en.js באותו מבנה.
   כלל ברזל: נתון חסר = null (יוצג כ-[__]). לא ממציאים.
   ========================================================================== */
window.MX_CONTENT = {
  meta: { lang: 'he', dir: 'rtl', placeholder: '[__]' },

  company: {
    brand: 'MASHINUX',
    legalName: 'משינוקס — פיתוח טכנולוגיות בע"מ',
    legalNameEn: 'MASHINUX - TECHNOLOGICAL DEVELOPMENT LTD',
    address: 'מושב אליקים',
    addressMarketing: 'סמוך ליקנעם',
    foundedYear: '2018',
    hours: 'ראשון–חמישי, 08:00–20:00'
  },

  contact: {
    phone: '054-4463469',
    phoneHref: 'tel:+972544463469',
    whatsappHref: 'https://wa.me/972544463469',
    email: 'Mashin.sc@gmail.com',
    formEmail: 'Mashin.sc@gmail.com',   // יעד הפניות והשרטוטים
    formMode: 'whatsapp',       // 'whatsapp' = הטופס פותח WhatsApp עם הודעה מוכנה (כמו בחבילה) · 'endpoint' = שליחה לשרת
    whatsappNumber: '972544463469',
    formEndpoint: null          // כתובת שרת לשליחת הטופס (רק כש-formMode = 'endpoint')
  },

  // פרטי ההסמכה — לעדכן כאן בלבד בחידוש
  certificate: {
    standard: 'ISO 9001:2015',
    body: 'ARS Assessment Private Limited',
    number: '050126019714',
    scope: 'Manufacture of precision machined mechanical components and assemblies (IAF Code 17)',
    scopeHe: 'מערכת ניהול האיכות שלנו מוסמכת לייצור רכיבים ומכלולים מכניים בעיבוד שבבי מדויק.',
    firstIssue: '2026-01-05',
    validUntil: '2027-01-04',   // לא מוצג באתר לאחר תאריך זה
    verifyUrl: 'https://www.arscert.com',
    verifyLabel: 'www.arscert.com',
    pdf: 'assets/certs/iso-9001-certificate.pdf',
    badge: 'assets/certs/iso-ars-badge.jpg'
  },

  flags: {
    clientsColorRow: false,     // שורת לוגואים נוספת בסקשן האיכות. כבויה — הלוגואים הצבעוניים מוצגים בסקשן התעשיות
    clientsApproved: true,      // לוגואים מוצגים. ⚠ לוודא אישור מכל לקוח ולהחליף בקבצים רשמיים
    responseTime: null,         // בעל העסק ביקש לא להציג זמן תגובה בכותרת
    maxFileMB: null             // מגבלת גודל קובץ בטופס
  },

  industries: [
    { id: 'medical', no: '01', name: 'מכשור רפואי',          client: 'biosense', line: 'רכיבים זעירים שבהם כל מיקרון נחשב.', image: null },
    { id: 'pharma',  no: '02', name: 'פארמה וביוטק',          client: 'biogal',   line: 'חלקים לתעשייה שעובדת לפי תקן ותיעוד.', image: null },
    { id: 'food',    no: '03', name: 'תעשיית מזון',           client: 'nestle',   line: 'חלקים לקווי ייצור שלא עוצרים.', image: null },
    { id: 'motion',  no: '04', name: 'בקרת תנועה ואוטומציה',  client: 'acs',      line: 'רכיבים מכניים למערכות תנועה מדויקות.', image: null }
  ],

  // מוצגים רק כאשר flags.clientsApproved = true
  // קבצי -mono.png הם פתרון זמני (נוקו מצילומי מסך) — להחליף בלוגו רשמי בגרסה לבנה/שקופה
  clients: {
    nestle:   { name: 'Nestlé / אסם',              logo: 'assets/clients/client-nestle-osem-mono.png', logoColor: 'assets/clients/client-nestle-osem-color.png' },
    biogal:   { name: 'Biogal Galed Labs',         logo: 'assets/clients/client-biogal-mono.png', logoColor: 'assets/clients/client-biogal-color.png' },
    biosense: { name: 'Biosense Webster (J&J)',    logo: 'assets/clients/client-biosense-webster-mono.png', logoColor: 'assets/clients/client-biosense-webster-color.png' },
    acs:      { name: 'ACS Motion Control',        logo: 'assets/clients/client-acs-mono.svg', logoColor: 'assets/clients/client-acs-color.svg' }
  },

  // שירותים. image = תמונה לשירות (אם יש)
  services: [
    { no: '01', name: 'שירותי כרסום CNC', line: 'כרסום ב-3 וב-5 צירים: כיסים, משטחים, חורים והברגות, מחלק בודד ועד סדרה.', image: 'assets/work/work-gear-bracket-3x2.jpg' },
    { no: '02', name: 'שירותי חריטת CNC', line: 'חלקים סיבוביים: צירים, תותבים וטבעות.', image: 'assets/work/work-steel-shaft.jpg' },
    { no: '03', name: 'השחזה עגולה', line: 'משטחים גליליים בדיוק של עד 0.001 מ"מ.', image: 'assets/machines/machine-bench-lathe.jpg' },
    { no: '04', name: 'הרכבות', line: 'הרכבה של מכלולים מוכנים לשימוש.', image: 'assets/work/work-amber-ring-assembly.jpg' }   // תמונה זמנית — בעל העסק ישלח תמונה
  ],

  // מהרך לקשה. part = עבודה מאותו חומר (אם קיימת)
  materials: [
    { id: 'plastic',   name: 'פלסטיק',    en: 'PLASTIC',   part: 'amber',   challenge: null },   // טבעת Ultem
    { id: 'aluminum',  name: 'אלומיניום', en: 'ALUMINUM',  part: 'al-box',  challenge: null },
    { id: 'brass',     name: 'פליז',      en: 'BRASS',     part: 'brass',   challenge: null, brass: true },
    { id: 'iron',      name: 'ברזל',      en: 'IRON',      part: 'shaft',   challenge: null },   // ציר פלדה
    { id: 'stainless', name: 'נירוסטה',   en: 'STAINLESS', part: 'ss-ring', challenge: null },
    { id: 'composite', name: 'מרוכבים',   en: 'COMPOSITE', part: null,      challenge: null },
    { id: 'ceramic',   name: 'קרמיקה',    en: 'CERAMIC',   part: null,      challenge: null },
    { id: 'glass',     name: 'זכוכית',    en: 'GLASS',     part: null,      challenge: null, focus: true }
  ],

  // עבודות נבחרות. כל התמונות מוצגות באותו גודל (ריבוע); pos = מיקוד החיתוך
  // צילומים על רקע בהיר — בזוג בסוף, עד צילום מחדש על רקע כהה
  works: [
    { id: 'shaft', title: 'ציר פלדה', image: 'assets/work/work-steel-shaft.jpg', w: 1600, h: 1066, layout: 'wide', pos: '56% 50%',
      material: 'פלדה', process: 'חריטה · השחזה עגולה', industry: null, challenge: null, qty: null,
      alt: 'ציר פלדה עם קטעים מושחזים ומשטחים מכורסמים, גפרור לקנה מידה' },
    { id: 'gear', title: 'חלק אלומיניום עם גלגל שיניים', image: 'assets/work/work-gear-bracket.jpg', w: 1065, h: 1600, layout: 'narrow', pos: '50% 30%',
      material: 'אלומיניום', process: 'כרסום CNC', industry: null, challenge: null, qty: null,
      alt: 'חלק אלומיניום מכורסם עם גלגל שיניים וכיס חצי-עגול, גפרור לקנה מידה' },
    { id: 'brass', title: 'גשר מחברים', image: 'assets/work/work-brass-block.jpg', w: 1600, h: 1066, layout: 'narrow', pos: '42% 50%',
      material: 'פליז', process: null, industry: null, challenge: null, qty: null,
      alt: 'גשר מחברים מפליז עם קדחים שקועים והברגה, ליד גפרור' },
    { id: 'al-bracket', title: 'תושבת אלומיניום עם הברגה', image: 'assets/work/work-al-bracket.jpg', w: 1600, h: 1194, layout: 'wide', pos: '45% 50%',
      material: 'אלומיניום', process: null, industry: null, challenge: null, qty: null,
      alt: 'תושבת אלומיניום עם תעלה, ציר מרכזי והברגה, גפרור לקנה מידה' },
    { id: 'al-box', title: 'קופסה דקת דופן', image: 'assets/work/work-al-box.jpg', w: 1600, h: 1066, layout: 'wide', pos: '50% 45%',
      material: 'אלומיניום', process: null, industry: null, challenge: null, qty: null,
      alt: 'קופסת אלומיניום דקת דופן, גפרור מונח לידה' },
    { id: 'u-spline', title: 'מפתח נירוסטה 316', image: 'assets/work/work-u-spline.jpg', w: 1600, h: 1066, layout: 'narrow', pos: '48% 40%',
      material: 'נירוסטה 316', process: null, industry: null, challenge: null, qty: null,
      alt: 'מפתח מנירוסטה 316 עם ספליין פנימי, גפרור לקנה מידה' },
    { id: 'ss-ring', title: 'טבעת נירוסטה', image: 'assets/work/work-ss-ring.jpg', w: 1600, h: 1066, layout: 'half', pos: '55% 45%',
      material: 'נירוסטה', process: null, industry: null, challenge: null, qty: null,
      alt: 'טבעת נירוסטה קטנה עם קדחים וחריצים, ליד גפרור' },
    { id: 'amber', title: 'טבעת Ultem עם פינים', image: 'assets/work/work-amber-ring-assembly.jpg', w: 1600, h: 1066, layout: 'half', pos: '54% 45%',
      material: 'Ultem', process: 'הרכבה', industry: null, challenge: null, qty: null,
      alt: 'טבעת Ultem ענברית עם פינים מתכתיים מורכבים, ליד גפרור' }
  ],
  worksFilterMin: 12,           // הסינון מופעל רק מ-12 פרויקטים ומעלה

  // פארק מכונות. שורה בלי שום נתון אמיתי — לא מוצגת
  machines: [
    { model: 'Hartford', type: 'מרכז עיבוד אנכי', axes: '3', table: '1000×500 מ"מ', travel: null, notes: 'כרסום CNC',
      image: 'assets/machines/machine-hartford-vmc.jpg', alt: 'מרכז עיבוד אנכי Hartford ברצפת הייצור', real: true },
    { model: 'FADAL', type: 'מרכז עיבוד 5 צירים', axes: '5', table: null, travel: null, notes: 'חלקים מורכבים עד 250 מ"מ',
      image: 'assets/machines/machine-fadal.jpg', alt: 'מרכז עיבוד FADAL', real: true },
    { model: null, type: 'משחזת עגולה שולחנית', axes: null, table: null, travel: null, notes: 'לחלקים זעירים ומדויקים',
      image: 'assets/machines/machine-bench-lathe.jpg', alt: 'משחזת עגולה שולחנית על שולחן עבודה', real: true },
    { model: null, type: null, axes: null, travel: null, notes: '', image: null, real: false }
  ],

  ranges: {
    partMin: null, partMax: null, seriesMax: null,
    partSize: 'מחלקים זעירים ועד 250 מ"מ בעיבוד 5 צירים',
    precision: '0.001 mm',      // לפי בעל העסק — תמיד מוצג עם "עד"
    precisionHe: 'דיוק עד מיקרון',
    series: 'אב-טיפוס וסדרות קטנות, בינוניות וגדולות',
    metrology: 'מדידים, פיני מדידה, קומפרטור, מד גובה, קליברים ומיקרומטרים.'
  },

  qualityProcess: [null, null, null],   // 3 משפטים — עד שיתקבל תיאור התהליך

  traveler: [
    { no: '01', name: 'קבלת שרטוט' },
    { no: '02', name: 'בדיקה הנדסית' },
    { no: '03', name: 'תכנון ותכנות' },
    { no: '04', name: 'ייצור' },
    { no: '05', name: 'בקרת איכות' },
    { no: '06', name: 'אספקה' }
  ],

  // שאלות נפוצות. a = null → השאלה לא מוצגת עד שתהיה תשובה
  faq: [
    { q: 'אילו קבצים אנחנו מקבלים?', a: 'STEP, IGES, DXF, DWG או PDF. אין קובץ? אפשר לצלם שרטוט מודפס ולשלוח לנו ב-WhatsApp.' },
    { q: 'עם אילו חומרים אנחנו עובדים?', a: 'פלסטיק לסוגיו, אלומיניום, נירוסטה לסוגיה, פליז, ברזל, חומרים מרוכבים, קרמיקה וגם זכוכית.' },
    { q: 'אילו תהליכים אנחנו מבצעים?', a: 'כרסום CNC, חריטת CNC, השחזה עגולה והרכבה של מכלולים.' },
    { q: 'האם אנחנו מייצרים גם אב-טיפוס?', a: 'כן. אנחנו מייצרים אב-טיפוס וסדרות קטנות, בינוניות וגדולות.' },
    { q: 'איזה דיוק אפשר לקבל?', a: 'עד 0.001 מ"מ. הדיוק בפועל תלוי בחלק, בחומר ובתהליך, ונבדוק אותו מול הדרישות בשרטוט שלכם.' },
    { q: 'האם יש לנו הסמכת איכות?', a: 'כן. מערכת ניהול האיכות שלנו מוסמכת ISO 9001:2015 על ידי ARS.' },
    { q: 'תוך כמה זמן מקבלים הצעת מחיר?', a: 'בדרך כלל תוך יום. שולחים שרטוט ב-WhatsApp או במייל, ואנחנו חוזרים עם הצעה.' },
    { q: 'כמה זמן לוקח לייצר אב-טיפוס?', a: 'בדרך כלל תוך יום, ובמקרים דחופים גם באותו היום.' },
    { q: 'איפה אנחנו נמצאים?', a: 'במושב אליקים, סמוך ליקנעם. אנחנו זמינים בימים ראשון עד חמישי, 08:00–20:00.' }
  ],

  nav: [
    { no: '01', label: 'אודות', href: '#about' },
    { no: '02', label: 'שירותים', href: '#services' },
    { no: '03', label: 'עבודות', href: '#works' },
    { no: '04', label: 'יכולות', href: '#capabilities' },
    { no: '05', label: 'איכות', href: '#quality' }
  ],
  // פריטים נוספים בתפריט הנייד בלבד (בדסקטופ יש כפתור "שלחו שרטוט" בכותרת)
  menuExtra: [
    { no: '06', label: 'שאלות נפוצות', href: '#faq' },
    { no: '07', label: 'שליחת שרטוט', href: '#rfq', cta: true }
  ],

  form: {
    accept: '.step,.stp,.iges,.igs,.dxf,.dwg,.pdf,image/*',
    formats: 'STEP · STP · IGES · IGS · DXF · DWG · PDF · JPG · PNG',
    jobTypes: ['אב-טיפוס', 'סדרה קטנה', 'סדרה בינונית'],
    otherMaterial: 'אחר / לא בטוח',
    errors: {
      required: 'שדה חובה',
      email: 'כתובת אימייל לא תקינה',
      phone: 'מספר טלפון לא תקין',
      fileOrText: 'בחרו שרטוט או תארו את החלק במילים'
    }
  },

  ui: {
    material: 'חומר', process: 'תהליך', industry: 'תעשייה', challenge: 'אתגר', qty: 'כמות',
    noPart: 'אין עדיין חלק מצולם מחומר זה',
    close: 'סגירה', prev: 'הקודם', next: 'הבא',
    filesSelected: n => n === 1 ? 'קובץ אחד נבחר' : `${n} קבצים נבחרו`,
    remove: 'הסרה'
  }
};
