import debug from 'debug';
import fs from 'fs';
import needle from 'needle';
import path from 'path';
import pako from 'pako';

const log = debug('render');

function encode64(data) {
    let r = '';
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 === data.length) {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
        }
        else if (i + 1 === data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        }
        else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
        }
    }
    return r;
}

function append3bytes(b1, b2, b3) {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3F;
    let r = "";
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    return r;
}

function encode6bit(b) {
    if (b < 10) {
        return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
        return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
        return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b === 0) {
        return '-';
    }
    if (b === 1) {
        return '_';
    }
    return '?';
}

export default async function render(sourceFolder, destFolder, sourceExt, destFormat, urlPrefix, printer) {

    log(`sourceFolder: ${sourceFolder}`);
    log(`destFolder: ${destFolder}`);
    log(`sourceExt: ${sourceExt}`);
    log(`destFormat: ${destFormat}`);
    log(`urlPrefix: ${urlPrefix}`);

    const filenames = fs.readdirSync(sourceFolder).filter((inFilename) => {
        return path.extname(inFilename) === `.${sourceExt}`
    });
    if (filenames.length === 0) {
        throw new Error('No matching PlantUML source files found!');
    }
    const promises = filenames.map((inFilename) => {
        const inPath = path.join(sourceFolder, inFilename);
        const outPath = path.join(destFolder, `${path.basename(inFilename, path.extname(inFilename))}.${destFormat}`)

        log(`inPath: ${inPath}`);
        log(`outPath: ${outPath}`);

        let content = unescape(encodeURIComponent(fs.readFileSync(inPath, 'utf-8')));
        content = pako.deflate(content, { to: 'string' });
        content = encode64(content.toString());

        const url = `${urlPrefix}${destFormat}/~1${content}`;

        return needle('get', url)
            .then(function(resp) {
                fs.writeFileSync(outPath, resp.body);
                printer.info(`${inPath} ${printer.dim('=>')} ${outPath}\n`, 'SUCCESS');
            })
            .catch(function(err) {
                printer.error(`${inPath} ${printer.dim('=>')} ${outPath} ${printer.red(err.message)}\n`,'FAILURE');
            });
    });
    log(`promises.length: ${promises.length}`);

    await Promise.all(promises);
}
