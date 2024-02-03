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
``` javascript
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