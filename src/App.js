import { useReducer, useRef } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":

        case "CREATE": {
            const created_date = new Date().getTime();
            const newItem = {
                ...action.data,
                created_date,
            };
            return [newItem, ...state];
        }

        case "REMOVE": {
            return state.filter((it) => it.id !== action.targetId);
        }

        case "EDIT": {
            return state.map((it) =>
                it.id === action.targetId
                    ? { ...it, content: action.newContent }
                    : it
            );
        }

        // 정의하지 않은 case일 경우 기존의 상태를 그대로 리턴
        default:
            return state;
    }
};

function App() {
    // const [data, setData] = useState([]);

    // dispatch를 실행하면 reducer가 실행되고, reducer가 리턴하는 값이 data가 된다.
    const [data, dispatch] = useReducer(reducer, []);

    const dataId = useRef(0);
    const onCreate = (author, content, emotion) => {
        dispatch({
            type: "CREATE",
            data: {
                author,
                content,
                emotion,
                id: dataId.current,
            },
        });
        dataId.current += 1;
    };

    const onRemove = (targetId) => {
        dispatch({ type: "REMOVE", targetId });
    };

    const onEdit = (targetId, newContent) => {
        dispatch({ type: "EDIT", targetId, newContent });
    };

    const getDiaryAnalysis = () => {
        console.log("일기 분석 시작");

        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100;
        return { goodCount, badCount, goodRatio };
    };

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis();

    return (
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <div>전체일기: {data.length}</div>
            <div>기분 좋은 일기: {goodCount}</div>
            <div>기분 나쁜 일기: {badCount}</div>
            <div>기분 좋은 일기 비율: {goodRatio}</div>
            <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
        </div>
    );
}

export default App;
