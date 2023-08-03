import { stringify } from "querystring";

const indexname = process.env.PINECONE_INDEX_NAME
const namespace = process.env.PINECONE_NAME_SPACE

const PINECONE_INDEX_NAME = `${indexname}`;
const PINECONE_NAME_SPACE = `${namespace}`;

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };