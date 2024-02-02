# useState
- 상태(state)를 관리하기 위한 Hook
- 함수 컴포넌트 내에서 상태를 지정하고 업데이트를 할 수 있다.
- useState 함수는 배열을 반환하며, 첫 요소는 현재의 상태 값이고, 두 번째 요소는 상태를 업데이트 하는 함수이다.
- 상태를 변화시키기 위해 onChage() 라는 이벤트를 사용해야 한다.

### onChange()
- 콜백함수 전달: 이벤트 객체를 매개변수로 전달받는다.
``` javascript
onChange={(e) => {
    console.log(e);
}}
```
- 즉, `onChange`는 "이벤트"라고 부를 수 있다.
- 발생했다는 것은 값이 바뀌었을 때 수행되는 이벤트
- input에 값이 입력되면 onChange에 전달한 콜백함수가 수행되는것

``` javascript
import React, { useState } from 'react';

function ExampleComponent() {
  // useState를 사용하여 상태 변수 count와 이를 업데이트하는 함수 setCount를 선언
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      {/* 버튼 클릭 시 setCount 함수를 호출하여 count 값을 증가시킨다. */}
      <button onClick={() => setCount(count + 1)}>
        카운트 증가
      </button>
    </div>
  );
}

export default ExampleComponent;

```