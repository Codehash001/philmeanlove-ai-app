import { Document } from 'langchain/document';
import { readFile } from 'fs/promises';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import csv from 'csv-parser';
import { marked } from 'marked';
import path from 'path';

export abstract class BufferLoader extends BaseDocumentLoader {
  constructor(public filePathOrBlob: string | Blob) {
    super();
  }

  protected abstract parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]>;

  public async load(): Promise<Document[]> {
    let buffer: Buffer;
    let metadata: Record<string, string>;
    if (typeof this.filePathOrBlob === 'string') {
      buffer = await readFile(this.filePathOrBlob);
      metadata = { source: this.filePathOrBlob };
    } else {
      buffer = await this.filePathOrBlob
        .arrayBuffer()
        .then((ab) => Buffer.from(ab));
      metadata = { source: 'blob', blobType: this.filePathOrBlob.type };
    }
    return this.parse(buffer, metadata);
  }
}

export class CustomPDFLoader extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const { pdf } = await PDFLoaderImports();
    const parsed = await pdf(raw);
    return [
      new Document({
        pageContent: parsed.text.toString(), // Convert to string
        metadata: {
          ...metadata,
          pdf_name: getPdfName(metadata.source),
          pdf_numpages: parsed.numpages,
        },
      }),
    ];
  }
}

export class CustomCSVLoader extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const documents: Document[] = [];
    return new Promise((resolve, reject) => {
      const stream = csv({ headers: true })
        .on('data', (data) => {
          const document = new Document({
            pageContent: JSON.stringify(data),
            metadata: { ...metadata },
          });
          documents.push(document);
        })
        .on('end', () => {
          resolve(documents);
        })
        .on('error', (err) => {
          reject(err);
        });

      stream.write(raw);
      stream.end();
    });
  }
}

export class CustomTextLoader extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const content = raw.toString();
    const document = new Document({
      pageContent: content,
      metadata: { ...metadata },
    });
    return [document];
  }
}

export class CustomMarkdownLoader extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const content = marked(raw.toString());
    const document = new Document({
      pageContent: content,
      metadata: { ...metadata },
    });
    return [document];
  }
}

async function PDFLoaderImports() {
  try {
    // the main entrypoint has some debug code that we don't want to import
    const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
    return { pdf };
  } catch (e) {
    console.error(e);
    throw new Error(
      'Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`.',
    );
  }
}

function getPdfName(source: string): string {
  return path.basename(source);
}


