import {Document} from 'langchain/document'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {loadSummarizationChain, LLMChain} from 'langchain/chains'
import {PromptTemplate} from 'langchain/prompts'
import {fetchData, ProblemType} from './db-handler'
import {ChainValues} from 'langchain/dist/schema'

function extractInfoFromDbData(problem: ProblemType) {
  let text = `Problem: ${problem.title}\nStatus: ${problem.status}\n`
  for (const variant of problem?.variants || []) {
    text += `- Variant: ${variant.content}\n`
    for (const subProblem of variant?.subProblems || []) {
      if (subProblem?.content) {
        text += `\u0020\u0020- Sub-problem: ${subProblem.content}\n`
      }
    }
  }
  return text
}

function generateTopics(llm: ChatOpenAI, text: ChainValues) {
  const template =
    'Choose UP TO 4 KEY TOPICS that better describe the problems from our platform based on the summary below:\n\n{text}'

  const prompt = new PromptTemplate({template, inputVariables: ['text']})
  const llmChain = new LLMChain({prompt, llm})
  const topics = llmChain.run(text)
  return topics
}

export async function dailyDigestLlm() {
  const sampleData = await fetchData()

  const docSplits = sampleData.map(extractInfoFromDbData)
  const docs = docSplits.map((split_text) => new Document({pageContent: split_text}))
  const llm = new ChatOpenAI({
    temperature: 0,
    maxTokens: 2000,
    modelName: 'gpt-3.5-turbo',
  })

  const summaryPrompTemplate = `Write a summary focusing only on the relevant information from the text below.\u0020
  Make sure to keep the terms and language used in the text: \n\n{text}.`
  const dailyDigestTemplate = `As Spark, your role is to create \u0020
  daily summaries of the latest problems created in our ideation platform.\u0020
  Following is the data structure:\n
  - Problem: the Problem title. \n
  - Status: the current Problem status.\n
  - Variant: a variant for the root Problem.\n
  - Sub-problem: another problem based on the root Problem.\n
  Your goal is to highlight the top key problems addressed by the team, along with some background based on the Problem\u0020
  and an enumerated list of Variants. You should omit the "Variant" text but keep it's value.\u0020
  Keep the tone light and engaging.\u0020
  This message will be featured on Spark's welcome page.\u0020
  You must keep the same terms and language used in the text\u0020
  so the users can identify the provided data.\u0020
  You must remove any underscores and uppercase letters from Status to make it user friendly.\u0020
  Here's the information about the latest problems: \n\n{text}.
  `

  const summaryPrompt = new PromptTemplate({
    template: summaryPrompTemplate,
    inputVariables: ['text'],
  })
  const dailyDigest = new PromptTemplate({
    template: dailyDigestTemplate,
    inputVariables: ['text'],
  })

  const chain = loadSummarizationChain(llm, {
    type: 'map_reduce',
    returnIntermediateSteps: true,
    combineMapPrompt: summaryPrompt,
    combinePrompt: dailyDigest,
  })

  const res = await chain.call({
    input_documents: docs,
  })

  const topics = await generateTopics(llm, res.intermediateSteps)

  return {
    output: res.text,
    topics,
  }
}
