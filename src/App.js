import React, { useMemo, useReducer, useRef } from "react";
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

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
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

    // App 컴포넌트가 재생성되어도 객체는 재생성 되지 않도록
    const memoizedDispatches = useMemo(() => {
        return { onCreate, onRemove, onEdit };
    }, []);

    const getDiaryAnalysis = () => {
        console.log("일기 분석 시작");

        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100;
        return { goodCount, badCount, goodRatio };
    };

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis();

    return (
        <DiaryStateContext.Provider value={data}>
            {/* data state가 변경되어도 DiaryDispatchContext는 리렌더링 되지 않는다. */}
            <DiaryDispatchContext.Provider value={memoizedDispatches}>
                <div className="App">
                    <DiaryEditor onCreate={onCreate} />
                    <div>전체일기: {data.length}</div>
                    <div>기분 좋은 일기: {goodCount}</div>
                    <div>기분 나쁜 일기: {badCount}</div>
                    <div>기분 좋은 일기 비율: {goodRatio}</div>
                    <DiaryList
                        diaryList={data}
                        onRemove={onRemove}
                        onEdit={onEdit}
                    />
                </div>
            </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
    );
}

export default App;
