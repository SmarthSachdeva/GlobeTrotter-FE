import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import axios from "axios";
import "./QuizPage.css";

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const navigate = useNavigate();

  // Fetch question on page load
  useEffect(() => {
    axios.get(`${BASE_URL}/api/v1/quiz/getquestion`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    })
    .then(response => setQuestion(response.data))
    .catch(error => console.error("Error fetching question:", error));
  }, []);

  // Handle answer submission
  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }

    axios.post(`${BASE_URL}/api/v1/quiz/submitanswer`, {
      clueId: question.clueId,
      guessedPlaceId: selectedOption
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    })
    .then(response => {
      setResultData(response.data);
      setShowResult(true);
    })
    .catch(error => console.error("Error submitting answer:", error));
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          {question ? (
            <>
              <h2>{question.clue}</h2>
              <div className="options-container">
                {question.options.map(option => (
                  <button
                    key={option.id}
                    className={selectedOption === option.id ? "selected" : ""}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </>
          ) : (
            <p>Loading question...</p>
          )}
        </>
      ) : (
        <div className="result-popup">
          <h3>{resultData.correct ? "🎉 Correct!" : "❌ Wrong!"}</h3>
          {!resultData.correct && (
            <p><strong>Correct Answer:</strong> {resultData.correctAnswer}</p>
          )}
          <p><strong>Fact:</strong> {resultData.fact}</p>
          <p><strong>Score Awarded:</strong> {resultData.scoreAwarded}</p>
          <p><strong>Total Score:</strong> {resultData.userScore}</p>
          
          <div className="result-buttons">
            <button onClick={() => window.location.reload()}>Play Again</button>
            <button onClick={() => navigate("/welcome")}>Go Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
