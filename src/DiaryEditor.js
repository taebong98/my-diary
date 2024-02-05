import { useState, useRef, useContext } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {

    const {onCreate} = useContext(DiaryDispatchContext);

    const authorInput = useRef();
    const contentInput = useRef();
    const [state, setState] = useState({
        author: "",
        content: "",
        emotion: 1,
    });

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (state.author.length < 1) {
            authorInput.current.focus();
            return;
        }

        if (state.content.length < 5) {
            contentInput.current.focus();
            return;
        }

        onCreate(state.author, state.content, state.emotion);
        setState({
            author: "",
            content: "",
            emotion: 1,
        });

        // API 호출
        /*
        const apiUrl = "http://localhost:8080/posts/diary";

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
        })
            .then((data) => {
                console.log("저장 성공", data);
            })
            .catch((error) => {
                console.log("저장실패:", error);
            });
        */
    };

    return (
        <div className="DiaryEditor">
            <h2>오늘의 일기</h2>
            <div>
                <input
                    ref={authorInput}
                    name="author"
                    value={state.author}
                    onChange={(e) => {
                        handleChangeState(e);
                    }}
                />
            </div>
            <div>
                <textarea
                    ref={contentInput}
                    name="content"
                    value={state.content}
                    onChange={(e) => {
                        handleChangeState(e);
                    }}
                />
            </div>
            <div>
                <span>오늘의 점수: </span>
                <select
                    name="emotion"
                    value={state.emotion}
                    onChange={(e) => {
                        handleChangeState(e);
                    }}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div>
                <button onClick={handleSubmit}>저장하기</button>
            </div>
        </div>
    );
};

export default DiaryEditor;
