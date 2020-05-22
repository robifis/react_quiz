// Neccessary Import
import React, { useState, useEffect } from "react";
const shuffle = require("shuffle-array");

// Destructred props from Header Component!
export default function Questions({
  questionNumber,
  paginate,
  cQ,
  questionAmount,
  update_Score,
  score
}) {
  // State for the shuffled Answers array as well as the correct answer!
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);

  // State for the question Amount!
  const [qA, setQA] = useState(questionAmount);

  // Function that calls the pagination function in the Header component!
  function nextQuestion() {
    paginate(questionNumber + 1);
  }

  // Function that checks for the correct answer and updates the score!
  function checkAnswer(event) {
    if (event.currentTarget.innerHTML === correctAnswer[0]) {
      update_Score(score + 1);
    }
  }

  // Storing data from API in state!!
  useEffect(() => {
    // Storing correct Answer!
    function getCorrectAnswer() {
      setCorrectAnswer(cQ.map(a => a.correct_answer));
    }

    // Storing both correct and incorrect answers in State!
    const answerArray = [];
    // Function to get data!
    function getAllAnswers() {
      return cQ.map(answers => {
        answers.incorrect_answers.map(a => {
          answerArray.push(a);
        });
        answerArray.push(answers.correct_answer);
      });
    }

    getCorrectAnswer();
    getAllAnswers();

    setAllAnswers(shuffle(answerArray));

    setQA(questionAmount);
  }, [cQ]);

  // Component that displays the questions!
  function DisplayQuestions() {
    return (
      <div>
        <div className="my-5">
          <ul className="list-group">
            {cQ.map(q => (
              <h3
                key={q}
                className="list-group-item list-group-item-success p-5"
              >
                {q.question}
              </h3>
            ))}
            {allAnswers.map(a => (
              <li
                key={a}
                value={a}
                onClick={event => {
                  nextQuestion();
                  checkAnswer(event);
                }}
                role="button"
                className="btn btn-light list-group-item p-3"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Conditional render, depending on the state of the game!
  if (qA === 1) {
    return (
      <div>
        <h1 className="text-center display-2 mt-5">
          Please select your criteria
        </h1>
      </div>
    );
  }
  if (questionNumber <= qA) {
    return (
      <div>
        <DisplayQuestions />
      </div>
    );
  } else if (questionNumber > qA) {
    return (
      <div className="my-5">
        <h1 className="display-1">Thank you for Playing</h1>
        <h2 className="display-3">You got {score} answers correct!</h2>
      </div>
    );
  }
}
