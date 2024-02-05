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
</button>;
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

# React Lifecycle

### 마운팅(Mounting): ex.초기화 작업

-   `constructor()`: 컴포넌트가 생성될 때 호출되는 메서드로, 초기 설정 및 상태 초기화를 수행한다.
-   `getDerivedStateFromProps()`: props에 따라 state를 업데이트하는 메서드로 컴포넌트가 마운트되기 전과 업데이트 될 때 호출된다.
-   `render()`: 컴포넌트의 UI를 렌더링한다.
-   **`componentDidMount()`**: 컴포넌트가 실제 DOM에 삽입된 후 호출되는 메서드로 초기 데이터 가져오기, 외부 라이브러리 초기화 등에 사용된다.

### 업데이트(Updating): ex.예외처리 작업

-   `getDerivedStateFromProps()`: 마운팅과 동일하게 props에 따라 state를 업데이트하는 메서드로 컴포넌트가 업데이트될 때 호출된다.
-   `getDerivedStateFromProps()`: 컴포넌트가 리렌더링할지 여부를 결정하는 메서드로 성능 최적화에 주로 활용된다.
-   `render()`: UI를 업데이트한다.
-   `getSnapshotBeforeUpdate`: 업데이트가 반영된 후 실제 DOM에 변화가 일어나기 전에 호출되는 메서드이다. 스크롤 위치를 유지하는 등의 작업에 사용된다.
-   **`componentDidUpdate()`**: 업데이트 반영 이후 호출되는 메서드로, 이전 상태나 props에 기반하여 작업을 수행한다.

### 언마운팅(Unmounting) ex.메모리 정리 작업

-   **`componentWillUnmount()`**: 컴포넌트가 제거되기 전에 호출되는 메서드로, 리소스 해제나 이벤트 리스너 제거 등의 정리작업에 사용된다.

# React Hooks

클래스형 컴포넌트에서만 사용 가능한 기능들을 함수형 컴포넌트에서도 사용할 수 있게 해주는 기능 (useState, useEffect, useRef 등)

### React Hook를 사용하는 이유

-   클래스형 컴포넌트의 길어지는 코드 길이 문제
-   중복코드, 가독성 문제 등

### useEffect

함수형 컴포넌트에서 react hooks를 이용해서 라이프사이클을 제어하는 기능을 제공

-   useEffect의 첫번째 파라미터에 콜백함수 전달
-   두번째 파라미터에 Dependecy Array라고 불리는 배열을 전달
    -   depth, Dependecy Array, 의존성 배열 등으로 부른다.

```js
useEffect(() => {
    // 콜백함수로 동작 정의
}, []); // 의존성 배열 -> 이 배열 내에 들어있는 값에 따라 콜백함수가 수행된다.
```

```js
// 컴포넌트가 mount 되는 시점에만 작동한다.
useEffect(() => {
    console.log("Mount!");
}, []);

// 컴포넌트가 update 되는 시점에만 작동한다.
// update: 컴포넌트가 리렌더링, 부모로부터 내려받는 props가 변경
useEffect(() => {
    console.log("Update!");
});

// Dependency Array의 값이 변화하게 되면 콜백함수가 수행된다.
useEffect(() => {
    console.log("count값 변경");
}, [count]);

// mount가 리턴하는 함수는 unmount 시점에 실행된다
const UnmountTest = () => {
    useEffect(() => {
        // Mount 시점에 실행
        console.log("Mount!");
        return () => {
            // Unmount 시점에 실행
            console.log("Unmount!");
        };
    }, []);

    return <div>Unmount Test Component</div>;
};
```

# useReducer

컴포넌트에서 상태변화 로직을 분리

App 컴포넌트는 복잡하고 많은 상태 변화 로직을 가지고 있다.

-   onCreate, onEdit, onRemove 등
-   컴포넌트가 가지고 있는 데이터를 참조해야 하기 때문에, 함수 바깥으로 분리하기 어려움
-   이렇게 코드가 많아지면서 컴포넌트가 무거워지는 것은 좋은 코드가 아님

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

-   state: 현재 상태를 나타내는 변수
-   dispatch: 액션을 발생시켜 상태를 업데이트 하는 함수
-   reducer: 상태를 업데이트하는 로직이 정의된 함수
-   initialState: 초기 상태 값

`useReducer`를 사용하면 상태 로직을 담당하는 로직이 별도의 함수인 reducer 함수로 분리된다. reducer 함수는 현재 상태(`state`)와 액션(`action`)을 받아 새로운 상태를 반환한다.

### dispatch

```js
const [count, dispatch] = useReducer(reducer, 1);

<button onClick={() => dispatch({ type: 1 })}>add1</button>;
<button onClick={() => dispatch({ type: 10 })}>add10</button>;
<button onClick={() => dispatch({ type: 100 })}>add100</button>;
```

1. `add` 버튼을 누르면 dispatch 함수가 호출된다.
2. dispatch 함수가 전달하는 객체에는 `type`이라는 프로퍼티를 전달해야하고, 이 객체를 `action` 객체라고 부른다.
    - `action`은 상태변화를 의미한다.
3. dispatch애 전달된 action 객체는 reducer로 날아간다.

### reducer

dispatch가 호출되면 상태변화가 일어나야하고, 상태변화에 대한 처리를 reducer가 수행한다.

-   첫번째 인자는 현재 상태인 state를 받는다.
-   두번째 인자는 dispatch에 전달된 action 객체를 받는다.

```js
const reducer = (state, action) => {
    switch (action.type) {
        case 1:
            return state + 1;
        case 10:
            return state + 10;
        case 100:
            return state + 100;
        default:
            return state;
    }
};
```

4. add100 버튼을 누르면 `dispatch({type: 100})` 함수가 실행되고, reducer는 action 객체(`{type: 100}`)을 전달받는다.
5. 상태변화를 처리하는 reducer 함수에서는 switch-case 문을 이용해서, action의 type에 따른 로직이 수행된다.
6. 반환하는 값은 새로운 state가 된다.

### App 컴포넌트의 useState를 useReducer로 변경

```js
// App 컴포넌트의 복잡성을 줄이기 위해 사용하는 Hooks이기 때문에, App 컴포넌트 외부에 정의한다.
const reducer = (state, action) => {
    switch (action.type) {
        case "onCreate":
    }
};

function App() {
    // dispatch를 실행하면 reducer가 실행되고, reducer가 리턴하는 값이 data가 된다.
    const [data, dispatch] = useReducer(reducer, []);
}
```