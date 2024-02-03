import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const dummyList = [
    {
        id: 1,
        author: "홍길동",
        content: "본문 1",
        emotion: 5,
        created_date: new Date().getTime(),
    },
    {
        id: 2,
        author: "아무개",
        content: "본문 2",
        emotion: 3,
        created_date: new Date().getTime(),
    },
    {
        id: 3,
        author: "손오공",
        content: "본문 3",
        emotion: 1,
        created_date: new Date().getTime(),
    },
];

function App() {
    return (
        <div className="App">
            <DiaryEditor />
            <DiaryList diaryList={dummyList} />
        </div>
    );
}

export default App;
