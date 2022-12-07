let fileReader = require('../..');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('file reader checks', () => {
  it('check xls file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.xls`)).to.contains(
      'Kathleen'
    );
  });

  it('check xlsx file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.xlsx`)).to.contains(
      'Kathleen'
    );
  });

  it('check pdf file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.pdf`)).to.contains('Dummy');
  });

  it('check docx file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.docx`)).to.contains(
      'Lorem ipsum'
    );
  });

  it('check doc file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.doc`)).to.contains(
      'Welcome'
    );
  });

  it('check csv file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.csv`)).to.contains(
      'First Name'
    );
  });

  it('check json file content', async () => {
    expect(await fileReader.getText(`${process.cwd()}/test/files/dummy.json`)).to.contains('Doe');
  });

  it('Throw error on unknown extension', async () => {
    try {
      await fileReader.getText(`${process.cwd()}/test/files/dummy.html`);
    } catch (err) {
      expect(String(err)).to.contains('Error: unknown extension found!');
    }
  });
});
