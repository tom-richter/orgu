import { BlitzPage, useQuery, useParam, Link, useRouter, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import Box from "@mui/material/Box"
import React, { Suspense } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import getQuestion from "app/questions/queries/getQuestion"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import DeleteButton from "app/core/components/DeleteButton"
import deleteQuestion from "app/questions/mutations/deleteQuestion"
import AnswerForm from "app/questions/components/AnswerForm"
import createAnswer from "app/questions/mutations/createAnswer"
import { CreateAnswer } from "app/questions/types"

const Content = () => {
  const questionId = useParam("id", "number")!
  const [question] = useQuery(getQuestion, questionId)
  const [createQuestionMutation] = useMutation(createAnswer)
  const router = useRouter()

  const onDeleteQuestion = async () => {
    await deleteQuestion(questionId)
    router.push("/questions")
  }

  const onCreateAnswer = async (question: CreateAnswer) => {
    try {
      const createdAnswer = await createQuestionMutation(question)
      router.reload()
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <Box>
      <Box>
        <h1>
          {question.title}{" "}
          <Link href={`/questions/${questionId}/edit`} passHref>
            <IconButton color="secondary">
              <EditIcon />
            </IconButton>
          </Link>
          <DeleteButton name="question" onSubmit={onDeleteQuestion} />
        </h1>
      </Box>
      <p>Status: {question.status}</p>
      <p>Assigned to: {question.assignedToPerson.name}</p>
      <h2>Answers</h2>
      <AnswerForm
        initialValues={{ description: "", questionId: questionId, personId: 1 }}
        onSubmit={onCreateAnswer}
      />

      {question.answers.map((answer) => (
        <Box key={answer.id}>
          <h3>{answer.person.name}</h3>
          <p>{answer.description}</p>
        </Box>
      ))}
    </Box>
  )
}

const QuestionPage: BlitzPage = () => {
  return (
    <Box>
      <Suspense fallback={<CircularProgress />}>
        <Content />
      </Suspense>
    </Box>
  )
}

QuestionPage.suppressFirstRenderFlicker = true
QuestionPage.getLayout = (page) => <Layout>{page}</Layout>

export default QuestionPage
