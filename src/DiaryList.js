import DiaryItem from "./DiaryItem";

const DiaryList = ({ diaryList }) => {
    return (
        <div className="DiaryList">
            <h2>일기 리스트</h2>
            <h4>{diaryList.length}개의 일기가 있습니다.</h4>

            {/* 2. 컴포넌트 랜더링 */}
            <div>
                {/* 3. map 함수를 사용하여 diaryList의 각 원소(it)에 대한 일기정보를 포함한 JSX를 반환한다.   */}
                {diaryList.map((it) => (
                    <DiaryItem key={it.id} {...it} /> // it이라는 객체가 포함하는 모든 데이터를 DiaryItem의 Prop으로 내려준다.
                ))}
            </div>
        </div>
    );
};

// DiaryList에 배열이 전달되지 않는 경우를 대비하여
// 기본값을 빈배열로 설정한다.
DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
