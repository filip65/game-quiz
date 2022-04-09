import React, { useState } from "react";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";
// styles
import { GlobalStyle, Wrapper } from "./App.styles";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const questions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setQuestions(questions);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const userAnswer = e.currentTarget.value;

    const isCorrect = questions[number].correct_answer === userAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const answerObject = {
      question: questions[number].question,
      answer: userAnswer,
      correctAnswer: questions[number].correct_answer,
      correct: isCorrect,
    };

    setUserAnswers((prev) => [...prev, answerObject]);
  };

  const nextQuestion = () => {
    if (number + 1 === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber((prev) => prev + 1);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>REACT QUIZ</h1>

        {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        )}

        {!gameOver && <p className="score">Score: {score}</p>}

        {loading && <p>Loading Questions...</p>}

        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {!loading &&
          !gameOver &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
}

export default App;
