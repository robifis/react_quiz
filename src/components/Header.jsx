// Neccessary imports

import React, { useState, useEffect } from "react";
import axios from "axios";
import Questions from "./Questions";

// Start of Function
export default function Header() {
  // This stores the current question number
  const [questionNumber, setQuestionNumber] = useState(1);
  // Function that updates the page Number when I select an Answer
  function paginate(questionNumber) {
    setQuestionNumber(questionNumber);
  }

  // This state stores the number of questions I want displayed per page!
  const [quizQuestionPerPage] = useState(1);

  // Math logic to calculate how many questions we want to display!
  // Can be controlled by editing the postsPerPage state!
  const indexOfLastQuestion = questionNumber * quizQuestionPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - quizQuestionPerPage;

  // Storing API Data
  const [apiData, setApiData] = useState([]);

  // User Score state
  const [score, setScore] = useState(0);
  function update_Score(score) {
    setScore(score);
  }

  // Current Post is being sliced from inside of the array!
  const cQ = apiData.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Lists all Categories in Header!
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      const res = await axios("https://opentdb.com/api_category.php");
      setAllCategories(res.data.trivia_categories);
    };
    getCategories();
  }, []);

  // Stores the selected Category in State to be used for API Call
  const [category, setCategory] = useState();
  function Category() {
    return (
      <select
        value={category}
        defaultValue={"DEFAULT"}
        onChange={e => setCategory(e.target.value)}
        className="px-2 mx-2"
      >
        <option value="DEFAULT" disabled>
          Select a Category...
        </option>
        {allCategories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    );
  }

  // Stores the selected Difficulty in State to be used for API Call
  const [difficulty, setDifficulty] = useState();
  function Difficulty() {
    return (
      <select
        value={difficulty}
        defaultValue={"DEFAULT"}
        onChange={e => setDifficulty(e.target.value)}
        className="mx-3 pr-5 pl-2"
      >
        <option value="DEFAULT" disabled>
          Select a Difficulty
        </option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    );
  }
  // Stores the Question Amount in State to be used for API Call
  const [questionAmount, setQuestionAmount] = useState(1);
  function QuestionNumber() {
    return (
      <input
        onChange={e => setQuestionAmount(e.target.value)}
        placeholder="10"
        type="number"
        value={questionAmount}
        className="px-2 mx-3"
      />
    );
  }

  // Play button in order to get the Questions from API
  function Playbutton() {
    return (
      <button className="btn btn-success px-5" onClick={fetchQuestions}>
        Play
      </button>
    );
  }

  // API Call to get questions!
  const fetchQuestions = async () => {
    if (questionNumber !== 1) {
      setQuestionNumber(1);
      setApiData([]);
      setScore(0);
    }
    const URL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const res = await axios.get(URL);
    setApiData(res.data.results);
    console.log(URL);
  };

  // Start of NavBar component
  function Navbar() {
    return (
      <div>
        <nav className="justify-content-center navbar navbar-dark bg-dark">
          <div className=" justify-content-center row w-100">
            <h1 className="display-3 text-white" disabled>
              Bob's Quiz
            </h1>
          </div>
          <div className="row">
            <form className="form-row my-4">
              <Category />
              <Difficulty />
              <QuestionNumber />
              <Playbutton />
            </form>
          </div>
        </nav>
      </div>
    );
  }

  // Rendering the component out!
  return (
    <div>
      <Navbar />
      <div className="container">
        <Questions
          cQ={cQ}
          questionNumber={questionNumber}
          paginate={paginate}
          questionAmount={questionAmount}
          update_Score={update_Score}
          score={score}
        />
      </div>
    </div>
  );
}
