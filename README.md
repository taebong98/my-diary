# useState

-   상태(state)를 관리하기 위한 Hook
-   함수 컴포넌트 내에서 상태를 지정하고 업데이트를 할 수 있다.
-   useState 함수는 배열을 반환하며, 첫 요소는 현재의 상태 값이고, 두 번째 요소는 상태를 업데이트 하는 함수이다.
-   상태를 변화시키기 위해 onChage() 라는 이벤트를 사용해야 한다.

### onChange(): 이벤트가 발생하면 콜백함수(`onChange`)가 수행된다.

-   콜백함수 전달: 이벤트 객체를 매개변수로 전달받는다.

```javascript
onChange={(e) => {
    console.log(e);
}}
```

-   즉, `onChange`는 "이벤트"라고 부를 수 있다.
-   발생했다는 것은 값이 바뀌었을 때 수행되는 이벤트
-   **변화한 값(`e.target.value`)를 `useState`의 상태변화 함수에 전달해주면 된다.**

```javascript
import React, { useState } from "react";

function ExampleComponent() {
    // useState를 사용하여 상태 변수 count와 이를 업데이트하는 함수 setCount를 선언
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>현재 카운트: {count}</p>
            {/* 버튼 클릭 시 setCount 함수를 호출하여 count 값을 증가시킨다. */}
            <button onClick={() => setCount(count + 1)}>카운트 증가</button>
        </div>
    );
}

export default ExampleComponent;
```

### useState 중복제거

```javascript
const [state, setState] = useState({
    author: "", // 작성자
    content: "", // 본문
});
<div>
    <input
        value={state.author}
        onChange={(e) => {
            setState({
                author: e.target.value, // 작성자만 변경하고
                content: state.content // 본문은 기존 state에서 그대로 가져온다
            });
        }}
    />
</div>

<div>
    <textarea
        value={state.content}
        onChange={(e) => {
            setState({
                author: state.author, // 작성자는 기존 state에서 그대로 가져온다
                content: e.target.value, // 본문은 변경되는 이벤트로 업데이트 한다.
            });
        }}
    />
</div>
```

### useState 중복제거 - spread 연산자 사용

```javascript
const [state, setState] = useState({
    author: "", // 작성자
    content: "", // 본문
});

<div>
    <input
        value={state.author}
        onChange={(e) => {
            setState({
                ...state, // 기존 state를 뿌려준다.
                author: e.target.value // 변경이 일어난 이벤트의 상태를 변경
            });
        }}
    />
</div>

<div>
    <textarea
        value={state.content}
        onChange={(e) => {

            // 동작하지 않음
            setState({ // 새로운 객체가 만들어질 때,
                content: e.target.value, // 1. 새로 변한 값이 들어옴
                ...state, // 2. spread 연산을 통해 기존의 값이 덮어 씌워짐
                // 3. 결과적으로 변화한 값이 원래의 값으로 덮어 씌워지기 때문에 아무것도 업데이트가 되지 않는다.
                // 4. 원래 있던 값을 펼친다음, 변화한 값을 마지막에 업데이트 해야함
            });
        }}
    />
</div>
```

### useState 중복제거 - 함수로 분리

```js
const DiaryEditor = () => {
    const [state, setState] = useState({
        author: "",
        content: "",
    });

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="DiaryEditor">
            <h2>오늘의 일기</h2>
            <div>
                <input
                    name="author"
                    value={state.author}
                    onChange={(e) => {
                        handleChangeState(e);
                    }}
                />
            </div>
    )
}
```

`handleChangeState()` 함수를 콜백으로 전달하여 값이 변경될 때마다 호출
입력란(`input`, `textarea` 등)의 name 속성에 따라 상태 객체의 속성을 업데이트 하도록 변경
스프레드 연산(...state)을 사용하여 기존의 상태를 복사하고 새로운 값을 갖는 속성만 업데이트
주의사항: 입력란의 name 속성과 useState 훅에서 관리하는 상태 객체의 속성 값을 맞춰야함. 즉 name 속성이 author로 설정되어 있다면 상태객체에서도 author 속성을 가지고 있어야함

# useRef

### MutableRefObject

useRef 훅에서 반환하는 객체이다.
해당 객체를 사용하여 html DOM 요소에 접근할 수 있다.

```js
const authorInput = useRef();

<input
    ref={authorInput} // 1. 입력란에 MutableRefObject(authorInput) 객체를 전달해주게 되면 해당 객체를 통해 input 태그에 접근이 가능하다.
    name="author"
    value={state.author}
    onChange={(e) => {
        handleChangeState(e);
    }}
/>;

const handleSubmit = () => {
    if (state.author.length < 1) {
        authorInput.current.focus(); // 2. (1)에서 전달된 객체를 이용하여 1글자 이상 입력되지 않았을 경우 focus 기능
        return;
    }

    // 이하 생략
};
```

-   DOM 요소를 선택하는 `useRef()`라는 기능으로 생성한 레퍼런스 객체는 현재 가리키는 값을 current로 접근 가능
-   즉, `authorInput.currnet`는 input 태그를 가리킨다.

# 데이터 추가하기

```js
function App() {
    // 상태 변수 data와 해당 상태를 업데이트하는 함수 setData를 생성, 기본값을 배열로 지정
    const [data, setData] = useState([]);

    // useRef를 사용하여 고유한 ID를 생성하는 변수 dataId를 생성, 실제로 데이터베이스 PK를 사용하는 것이 좋다.
    const dataId = useRef(0);

    // onCreate 함수는 DiaryEditor에서 호출되어 새로운 일기를 생성하고 상태를 업데이트 한다.
    const onCreate = (author, content, emotion) => {
        // 현재 시간을 밀리초로 받아온다. 실제로 서버에서 응답을 받아 사용할 수 있다.
        const created_date = new Date().getTime();

        // 새로운 항목(newItem)을 생성
        const newItem = {
            author,
            content,
            emotion,
            created_date,
            // dataId.current를 사용하여 현재 ID를 받아와 항목의 ID로 설정
            id: dataId.current,
        };

        // dataId.current를 증가시켜 다음 항목에 대한 ID를 준비
        dataId.current += 1;

        // setData를 사용하여 기존의 data 배열에 새로운 항목을 추가
        setData([newItem, ...data]);

        // 저장 후 작성한 본문을 초기화
        setState({
            author: "",
            content: "",
            emotion: 1,
        });
    };

    // DiaryEditor 컴포넌트를 렌더링하고, onCreate 함수를 props로 전달
    return (
        <div>
            {/* DiaryEditor 컴포넌트를 렌더링하고, onCreate 함수를 props로 전달 */}
            <DiaryEditor onCreate={onCreate} />
        </div>
    );
}
```

# 데이터 삭제하기
```js
// onDelete 함수 정의: targetId에 해당하는 일기를 삭제하고 상태를 업데이트하는 역할
const onDelete = (targetId) => {
    // filter 함수를 사용하여 targetId와 일치하지 않는 항목들만으로 이루어진 새로운 배열을 생성
    const newDiaryList = data.filter((it) => it.id !== targetId);
    // setData 함수를 사용하여 상태를 업데이트
    setData(newDiaryList);
};

// 삭제하기 버튼을 눌렀을 때의 처리를 담은 JSX 코드
<button
    onClick={() => {
        // 사용자에게 확인 메시지를 띄우고, 확인 시 onDelete 함수를 호출하여 일기를 삭제
        if (window.confirm(`${id}번째 일기를 삭제하시겠습니까?`)) {
            onDelete(id);
        }
    }}
>
    삭제하기
</button>
```

# 데이터 수정하기
```js
const DiaryItem = ({
    id,
    author,
    content,
    emotion,
    created_date,
    onRemove,
    onEdit,
}) => {
    // 수정 중인지 여부를 나타내는 상태 변수와 해당 상태를 업데이트하는 함수를 생성
    const [isEdit, setIsEdit] = useState(false);
    // isEdit이 true일 때, 수정 중인 내용을 저장하는 상태 변수와 해당 상태를 업데이트하는 함수를 생성
    const [localContent, setLocalContent] = useState(content);
    // 수정 중인 내용을 입력할 때 사용하는 ref 변수를 생성
    const localContentInput = useRef();

    // 수정 중인지 여부를 토글하는 함수를 정의
    const toggleIsEdit = () => {
        setIsEdit(!isEdit);
    };

    // 삭제 버튼 클릭 시 처리하는 함수를 정의
    const handleRemove = () => {
        // 사용자에게 확인 메시지를 띄우고, 확인 시 onRemove 함수를 호출하여 일기를 삭제
        if (window.confirm(`${id}번째 일기를 삭제하시겠습니까?`)) {
            onRemove(id); // App 컴포넌트의 상태를 변경하는 작업이기 때문에 App 컴포넌트에 정의되어 있음
        }
    };

    // 수정 취소 버튼 클릭 시 처리하는 함수를 정의
    const handleQuitEdit = () => {
        // 수정 중이던 상태를 종료하고,
        setIsEdit(false);

        // 수정 중인 내용을 원래 내용(content)으로 복구
        setLocalContent(content);
    };

    // 수정 완료 버튼 클릭 시 처리하는 함수를 정의
    const handleEdit = () => {
        // 수정 중인 내용이 일정 길이 미만인 경우, 입력 필드에 포커스를 맞추고 함수를 종료 => 생성과 같은 조건을 맞춰야함
        if (localContent.length < 5) {
            localContentInput.current.focus();
            return;
        }

        // 사용자에게 확인 메시지를 띄우고, 확인 시 onEdit 함수를 호출하여 일기를 수정
        if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
            onEdit(id, localContent); // App 컴포넌트의 상태를 변경하는 작업이기 때문에 App 컴포넌트에 정의되어 있음

            // 수정 완료 후 수정 중인 상태를 토글하여 수정창을 닫는다.
            toggleIsEdit();
        }
    };

    // JSX로 일기 항목을 렌더링
    return (
        <div className="DiaryItem">
            <div className="info">
                <span>
                    작성자 : {author} | 감정 점수 : {emotion}
                </span>
                <br />
                <span className="date">
                    {new Date(created_date).toLocaleString()}
                </span>
            </div>
            <div className="content">
                {/* 수정 중인 경우 textarea로 수정 중인 내용을 보여준다. */}
                {isEdit ? (
                    <>
                        <textarea
                            ref={localContentInput}
                            value={localContent}
                            onChange={(e) => {
                                // 수정 중인 내용을 업데이트한다.
                                setLocalContent(e.target.value);
                            }}
                        />
                    </>
                ) : (
                    // 수정 중이 아닌 경우에는 내용을 그대로 출력한다.
                    <>{content}</>
                )}
            </div>

            {/* 수정 중인 상태에 따라 버튼을 다르게 표시한다. */}
            {isEdit ? (
                <>
                    <button onClick={handleQuitEdit}>수정취소</button>
                    <button onClick={handleEdit}>수정완료</button>
                </>
            ) : (
                <>
                    <button onClick={handleRemove}>삭제하기</button>
                    <button onClick={toggleIsEdit}>수정하기</button>
                </>
            )}
        </div>
    );
};
```