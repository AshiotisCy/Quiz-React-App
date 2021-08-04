import { Button, Input } from "antd"
import { useContext } from "react"
import { GameStateContext } from "../helpers/Contexts"

function Menu() {

    const { gameState, setGameState, userName, setUserName, questions } = useContext(GameStateContext)

    return (
        <div className="Menu">
            <div className="MenuDescription">
                <label>
                    {questions.description}
                </label>
            </div>
            <div className="MenuWrapper">
                <div className="UserName">Please Enter your name:</div>
                <Input type="text" placeholder="Please enter your name" onChange={(event) => setUserName(event.target.value)} />
                <Button onClick={() => { setGameState('playing') }}>
                    Start Quiz
                </Button>
            </div>
        </div>
    )
}

export default Menu;