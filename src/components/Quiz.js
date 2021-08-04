import { useContext, useEffect, useState } from "react"
import { GameStateContext } from "../helpers/Contexts"
import { Button } from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox"
import _ from "lodash"

function Quiz() {

    const { questions, setGameState, getResults, userName, setUserName } = useContext(GameStateContext)
    const [currentQuestion, setCurrentQuestion] = useState(7)
    const [isCheckedSingle, setIsCheckedSingle] = useState()
    const [correctAnswer, setCorrectAnswer] = useState()
    const [points, setPoints] = useState()
    const [score, setScore] = useState(0)
    const [multiScore, setMultiScore] = useState([])
    const [answerClicked, setAnswerClicked] = useState(false)

    useEffect(() => {
        if (currentQuestion < questions.questions.length) {
            setCorrectAnswer(questions.questions[currentQuestion].correct_answer)
            setPoints(questions.questions[currentQuestion].points)
        }
    }, [currentQuestion])

    const onRestart = () => {
        setCurrentQuestion(0)
        setScore(0)
        setUserName(undefined)
        setGameState("menu")
    }

    const onHandleCheck = (CheckboxId) => {
        const itemPosition = multiScore.indexOf(CheckboxId)
        if (itemPosition !== -1) {
            setMultiScore(_.without(multiScore.filter((value, index) => multiScore.indexOf(value) === index), CheckboxId))
        } else {
            setMultiScore([...multiScore, CheckboxId])
        }

    }

    const handleAnswer = (singleAnswer, multiAnswer) => {

        setAnswerClicked(true)

        if (singleAnswer !== undefined) {

            if (singleAnswer === correctAnswer) {
                setScore(score + points)
            }

            else {
                setScore(score)
            }

            setCorrectAnswer(undefined)
            setPoints(0)
            setIsCheckedSingle(undefined)


            document.getElementById(`${singleAnswer}`).style.backgroundColor = 'rgb(214, 28, 28, 90%)';
            document.getElementById(`${correctAnswer}`).style.backgroundColor = 'rgb(52, 146, 52, 90%)';

        }

        if (singleAnswer === undefined && multiAnswer.length < 1) {
            if (Array.isArray(correctAnswer)) {
                correctAnswer.map(el => {
                    document.getElementById(`${el}`).style.background = 'rgb(52, 146, 52, 90%)';
                    document.getElementById(`checkbox_${el}`).click()
                })
            } else {
                document.getElementById(`${correctAnswer}`).style.backgroundColor = 'rgb(52, 146, 52, 90%)';
            }

        }

        if (multiAnswer.length > 0) {

            const containsAll = (multiAnswer, correctAnswer) => correctAnswer.every(correctItem => multiAnswer.includes(correctItem))
            const sameMembers = (multiAnswer, correctAnswer) => containsAll(multiAnswer, correctAnswer) && containsAll(correctAnswer, multiAnswer)

            if (sameMembers) {
                setScore(score + points)
            }

            else {
                setScore(score)
            }

            setCorrectAnswer(undefined)
            setPoints(0)
            setMultiScore([])

            multiAnswer.map(el => {
                if (correctAnswer.includes(el)) {
                    document.getElementById(`${el}`).style.background = 'rgb(52, 146, 52, 90%)';
                    // document.getElementById(`${el}`).click()
                } else {
                    document.getElementById(`${el}`).style.background = 'rgb(214, 28, 28, 90%)';
                }
            })

            correctAnswer.map(el => {
                document.getElementById(`${el}`).style.background = 'rgb(52, 146, 52, 90%)';
            })

        }


        setTimeout(() => {

            questions.questions[currentQuestion]?.possible_answers.map(opt => {
                document.getElementById(`${opt.a_id}`).style.backgroundColor = '#456c86';
            })

        }, 2900)

        setTimeout(() => {
            setCurrentQuestion(currentQuestion + 1)
            setAnswerClicked(false)
            setMultiScore([])
        }, 3000)

    }

    return (
        <div className="Quiz" >
            {console.log("userName", userName)}
            {questions.questions[currentQuestion] ?
                <div className="wrapper" >
                    <h5 className="quiz-title">{questions.questions[currentQuestion].title}</h5>
                    <div className="QuizWrap" style={{ backgroundImage: "url(" + questions.questions[currentQuestion]?.img + ")" }}>
                        <div className="Questions">
                            {questions.questions[currentQuestion]?.question_type === "multiplechoice-single" &&
                                <div >

                                    {questions.questions[currentQuestion].possible_answers.map(opt => {
                                        return (
                                            <div className="col-12">
                                                <Button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    id={opt.a_id}
                                                    className="Option"
                                                    onClick={() => { setIsCheckedSingle(opt.a_id) }}>
                                                    {opt.caption}
                                                </Button>

                                            </div>
                                        )
                                    })}
                                </div>
                            }
                            {questions.questions[currentQuestion]?.question_type === "multiplechoice-multiple" &&
                                <div className="checkbox-options">
                                    <div className="multipleChoice-Title">You must select more than one answer</div>
                                    {questions.questions[currentQuestion].possible_answers.map(opt => {
                                        return (
                                            <div className="col-12 checkboxes" id={`${opt.a_id}`}>

                                                <Checkbox
                                                    id={`checkbox_${opt.a_id}`}
                                                    className="Option"
                                                    onChange={() => { onHandleCheck(opt.a_id) }}>
                                                    {opt.caption}
                                                </Checkbox>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                            {questions.questions[currentQuestion].question_type === "truefalse" &&
                                <div >

                                    {questions.questions[currentQuestion].possible_answers.map(opt => {
                                        return (
                                            <div className="col-12">
                                                <Button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    id={opt.a_id}
                                                    className="Option"
                                                    onClick={() => { setIsCheckedSingle(opt.a_id) }}>
                                                    {opt.caption}
                                                </Button>

                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div className="footerButton">
                            <Button onClick={() => handleAnswer(isCheckedSingle, multiScore)} loading={answerClicked}>
                                Answer
                            </Button>
                        </div>
                    </div>
                </div>
                : <div className="endPage-wrapper">

                    {getResults.results.map(el => {
                        if (score * 5 >= el.minpoints && score * 5 <= el.maxpoints) {
                            return (
                                <div className="endPage">
                                    <div className="endPage-Title">
                                        You have finished the question game. ({el.title})
                                    </div>
                                    <div className="endPage-background-image" style={{ backgroundImage: "url(" + el?.img + ")" }}>

                                        <div className="endPage-message">
                                            {el.message}
                                        </div>
                                        <div className="endPage-middle-wrapper">
                                            <div className="endPage-Score">
                                                {userName ? (userName + "'s") : "Your"} Score: {score * 5}
                                            </div>

                                            <div className="restartGame">
                                                <Button
                                                    onClick={() => onRestart()}>
                                                    Restart Game
                                                </Button>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            )
                        } else {
                            return console.log("something went wrong")
                        }
                    })}
                </div>
            }
        </div >

    )
}

export default Quiz