import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain , VectorDBQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question. "add according to the provided context" at the end.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.\n Please provide a well-described answer with full details in context. The answer should be well-structured and spaced as an article.\nIf the answer is a list provide well-ordered numeric list like 1\n 2\n 3\n \n
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.\n
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.\n

{context}

Question: {question}
Helpful answer in well-structured markdown format:`,
);

export const makeChain = (
  vectorstore: PineconeStore,
  numberOfSourceDocs : number,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0.7,
      modelName: 'gpt-4', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token);
              console.log(token);
            },
          })
        : undefined,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    k: numberOfSourceDocs, //number of source documents to return
  });
};
