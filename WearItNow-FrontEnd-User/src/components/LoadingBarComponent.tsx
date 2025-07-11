import React from 'react';
import LoadingBar from 'react-top-loading-bar';

const LoadingBarComponent: React.FC<{ progress: number }> = ({progress}) => {
    return (
        <LoadingBar
            color="#3399FF" // Màu của thanh chạy
            progress={progress} // Tiến độ thanh loading
        />
    );
};

export default LoadingBarComponent;