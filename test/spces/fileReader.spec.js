let fileReader = require('../..');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('file reader checks', () => {
  it('check xls file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.xls`;
    expect(await fileReader.getText({filePath: filePath})).to.contains(
      'Kathleen'
    );
  });

  it('check xlsx file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.xlsx`;
    expect(await fileReader.getText({filePath: filePath})).to.contains(
      'Kathleen'
    );
  });

  it('check pdf file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.pdf`;
    expect(await fileReader.getText({filePath: filePath})).to.contains('Dummy');
  });

  it('check docx file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.docx`;
    expect(await fileReader.getText({filePath: filePath})).to.contains(
      'Lorem ipsum'
    );
  });

  it('check doc file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.doc`;
    expect(await fileReader.getText({filePath: filePath})).to.contains(
      'Welcome'
    );
  });

  it('check csv file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.csv`;
    expect(await fileReader.getText({filePath: filePath})).to.contains(
      'First Name'
    );
  });

  it('check json file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.json`;
    expect(await fileReader.getText({filePath: filePath})).to.contains('Doe');
  });

  it('check pptx file content', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.pptx`;
    expect((await fileReader.getText({filePath})).toString()).to.contains(
      'Sample'
    );
  });

  it('Throw error on unknown extension', async () => {
    try {
      const filePath = `${process.cwd()}/test/files/dummy.html`;
      await fileReader.getText({filePath: filePath});
    } catch (err) {
      expect(String(err)).to.contains('Error: unknown extension found!');
    }
  });

  it('xls whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.xls`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.xls';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Kathleen'
    );
  });

  it('xlsx whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.xlsx`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.xlsx';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Kathleen'
    );
  });

  it('pdf whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.pdf`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.pdf';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Dummy'
    );
  });

  it('docx whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.docx`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.docx';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Lorem ipsum'
    );
  });

  it('doc whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.doc`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.doc';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Welcome'
    );
  });

  it('csv whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.csv`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.csv';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'First Name'
    );
  });

  it('json whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.json`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.json';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect(await fileReader.getText({ fileData, fileExtension })).to.contains(
      'Doe'
    );
  });

  it('pptx whit buffer reader', async () => {
    const filePath = `${process.cwd()}/test/files/dummy.pptx`;
    const fileData = fs.readFileSync(filePath);
    const fileExtension = '.pptx';
    const result = await fileReader.getText({ fileData, fileExtension });

    expect((await fileReader.getText({ fileData, fileExtension })).toString()).to.contains(
      'Sample'
    );
  });
  it('Throw error on unknown extension with buffer reader', async () => {
    try {
      const filePath = `${process.cwd()}/test/files/dummy.html`;
      const fileData = fs.readFileSync(filePath);
      const fileExtension = '.html';
      await fileReader.getText({ fileData, fileExtension });
    } catch (err) {
      expect(String(err)).to.contains('Error: unknown extension found!');
    }
  });

  it('Throw error on unknown extension with buffer reader', async () => {
    try {
      const filePath = `${process.cwd()}/test/files/dummy.html`;
      const fileData = fs.readFileSync(filePath);
      const fileExtension = '.html';
      await fileReader.getText({ fileData, fileExtension });
    } catch (err) {
      expect(String(err)).to.contains('Error: unknown extension found!');
    }
  });

});
