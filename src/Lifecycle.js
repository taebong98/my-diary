import React, { useEffect, useState } from "react";

const UnmountTest = () => {
    useEffect(() => {
        console.log("Mount!");
        return () => {
            // Unmount 시점에 실행
            console.log("Unmount!");
        };
    }, []);

    return <div>Unmount Test Component</div>;
};

const LifeCycle = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={toggle}>ON/OFF</button>
            {isVisible && <UnmountTest />}
        </div>
    );
};

export default LifeCycle;
