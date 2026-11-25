import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, '../src/content/privacyNotice.ts');

if (!fs.existsSync(targetFile)) {
  console.error(`Error: File not found at ${targetFile}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(targetFile, 'utf8');
const lines = fileContent.split(/\r?\n/);

const blanksFound = [];

// Match bracketed placeholder blanks like [COMPANY LEGAL NAME], [SMS PROVIDER], [Google Gemini: ...], [NUMBER]
const placeholderRegex = /\[([A-Z][^\]"]*?)\]/g;

lines.forEach((line, index) => {
  const lineNum = index + 1;
  const trimmed = line.trim();

  // Skip comment lines in file header
  if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
    return;
  }

  let match;
  while ((match = placeholderRegex.exec(line)) !== null) {
    blanksFound.push({
      line: lineNum,
      blank: match[0],
      raw: line.trim()
    });
  }
});

if (blanksFound.length === 0) {
  console.log('✅ No bracketed blanks found in privacyNotice.ts.');
  process.exit(0);
} else {
  console.log(`⚠️ Found ${blanksFound.length} bracketed blank(s) in privacyNotice.ts:\n`);
  blanksFound.forEach((item) => {
    console.log(`  Line ${item.line}: ${item.blank}`);
  });
  console.log('\nAudit complete: unresolved bracketed blanks remain.');
  process.exit(1);
}
