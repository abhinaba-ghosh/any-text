const fs = require('fs');
const StreamZip = require('node-stream-zip');
const XLSX = require('xlsx');
const pdf = require('pdf-parse/lib/pdf-parse');
const JSZip = require('jszip');
let WordExtractor = require('word-extractor');
const { DOMParser } = require('xmldom');


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
        body += content;
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

getTextFromPPTX = async (buffer) => {
  try {
      const zip = new JSZip();
      await zip.loadAsync(buffer);

      const aNamespace =
          "http://schemas.openxmlformats.org/drawingml/2006/main";
      let text = [];

      let slideIndex = 1;
      while (true) {
          const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);

          if (!slideFile) break;

          const slideXmlStr = await slideFile.async("text");

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
              slideXmlStr,
              "application/xml"
          );

          text.push(getTextFromNodes(xmlDoc, "t", aNamespace));
          slideIndex++;
      }

      return text;
  } catch (err) {
      console.error("Error extracting text from PPTX:", err);
      return "";
  }
}

function getTextFromNodes(node, tagName, namespaceURI) {
  let text = "";
  const textNodes = node.getElementsByTagNameNS(namespaceURI, tagName);
  for (let i = 0; i < textNodes.length; i++) {
      text += textNodes[i].textContent + " ";
  }
  return text.trim();
}



// get the file extension based on the file path
getFileExtension = (filename) => {
  if (filename.length == 0) return '';
  let dot = filename.lastIndexOf('.');
  if (dot == -1) return '';
  const extension = filename.substr(dot, filename.length);
  return extension;
};

// read the file and extract text
exports.getText = async ({ filePath, fileData, fileExtension }) => {
  let fileContent = '';

  if (filePath) {
    // Legge il file dal percorso specificato
    fileData = fs.readFileSync(filePath);
    fileExtension = getFileExtension(filePath);
  } else if (!fileData || !fileExtension) {
    throw new Error('you have to provide either file path or file data and extension!');
  }

  if(!fileExtension){
    fileExtension = getFileExtension(filePath);
  }
  if(!fileData){
    var data = fs.readFileSync(filePath);
  }else{
    var data = fileData;
  }
  switch (fileExtension) {
    // read pdf
    case '.pdf':
      fileContent = (await pdf(data)).text;
      break;

    // read docs
    case '.docx':
    case '.doc':
      var extractor = new WordExtractor();
      var extracted = await extractor.extract(data);
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

    // read text, csv and json
    case '.txt':
    case '.csv':
    case '.json':
      fileContent = data.toString();
      break;
    case '.pptx':
      fileContent = await getTextFromPPTX(data);
      break;
    // default case
    default:
      throw new Error('unknown extension found!');
  }
  return fileContent;
};
