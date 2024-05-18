## Any-Text

Extract text content from a file.

### Supported File Extensions

- DOC
- DOCX
- DOT
- PDF
- CSV
- TXT
- XLS
- XLSX
- JSON
- PPTX

### How to use

- Install the library as a dependency (/dev-dependency)

```ssh
npm i -D any-text
```

- Make use of the `getText` method to read the text content

```js
var reader = require('any-text');

reader
  .getText({ filePath: `path-to-file` })
  .then(function (data) {
    console.log(data); // handle success
  })
  .catch(function (error) {
    console.log(error); // handle error
  });
```

- You can also use the `async/await` notation

```js
var reader = require('any-text');

const text = await reader.getText({ filePath: `path-to-file` });

console.log(text);
```

- The `getText` method now also supports buffer input
```js
var reader = require('any-text');

const buffer = fs.readFileSync(`path-to-file`);
const text = await reader.getText({ fileData: buffer, fileExtension: '.pdf' });

console.log(text);

```


### Sample Test

```js
var reader = require('any-text');

const chai = require('chai');
const expect = chai.expect;

describe('file reader checks', () => {
  it('check docx file content', async () => {
    expect(await reader.getText({ filePath: `${process.cwd()}/test/files/dummy.docx` })).to.contains(
      'Lorem ipsum'
    );
  });
  
  it('check pptx file content', async () => {
    expect(await reader.getText({ filePath: `${process.cwd()}/test/files/sample.pptx` })).to.contains(
      'Sample text'
    );
  });
});

```

### Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/any-text/issues)

### Contribution

Any pull request is welcome.

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/any-text)! :star:

_- Copyright &copy; 2020- [Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)_
