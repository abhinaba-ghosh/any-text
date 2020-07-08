const fs = require('fs');
const StreamZip = require('node-stream-zip');
const XLSX = require('xlsx');
const pdf = require('pdf-parse');
var WordExtractor = require('word-extractor');

// extract text from office books as doc and docx
extract = (filePath) => {
  return new Promise((resolve, reject) => {
    open(filePath).then((res, err) => {
      if (err) {
        reject(err);
      }
      let body = '';
      let components = res.toString().split('<w:t');
      for (let i = 0; i < components.length; i++) {
        let tags = components[i].split('>');
        let content = tags[1].replace(/<.*$/, '');
        body += content + ' ';
      }
      resolve(body);
    });
  });
};

// stream
open = (filePath) => {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file: filePath,
      storeEntries: true,
    });
    zip.on('ready', () => {
      let chunks = [];
      let content = '';
      zip.stream('word/document.xml', (err, stream) => {
        if (err) {
          reject(err);
        }
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        stream.on('end', () => {
          content = Buffer.concat(chunks);
          zip.close();
          resolve(content.toString());
        });
      });
    });
  });
};

// get the file extension based on the file path
getFileExtension = (filename) => {
  if (filename.length == 0) return '';
  let dot = filename.lastIndexOf('.');
  if (dot == -1) return '';
  const extension = filename.substr(dot, filename.length);
  return extension;
};

// read the file and extract text
exports.getText = async (filePath) => {
  let fileContent = '';

  let data = fs.readFileSync(filePath);
  const fileExtension = getFileExtension(filePath);

  switch (fileExtension) {
    // read pdf
    case '.pdf':
      fileContent = await (await pdf(data)).text;
      break;

    // read docs

    case '.docx':
      fileContent = await extract(filePath);
      break;

    case '.doc':
      var extractor = new WordExtractor();
      var extracted = await extractor.extract(filePath);
      fileContent = extracted.getBody();
      break;

    // read excel books
    case '.xlsx':
    case '.xls':
      let result = {};
      data = new Uint8Array(data);
      let workbook = XLSX.read(data, {
        type: 'array',
      });
      workbook.SheetNames.forEach(function (sheetName) {
        let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        if (roa.length) result[sheetName] = roa;
      });
      fileContent = JSON.stringify(result);
      break;

    // read text and csv
    case '.txt':
    case '.csv':
      fileContent = data.toString();
      break;

    // default case
    default:
      throw new Error('unknown extension found!');
  }
  // console.log(`This is file content ==> ${fileContent}`);
  return fileContent;
};
