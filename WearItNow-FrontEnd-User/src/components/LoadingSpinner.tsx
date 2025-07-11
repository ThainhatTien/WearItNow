import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner: React.FC<{ fullscreen?: boolean }> = ({ fullscreen }) => {
    return (
        <div className={fullscreen ? "flex items-center justify-center h-screen" : "flex items-center justify-center"}>
            <Spin size="large" />
        </div>
    );
};

export default LoadingSpinner;
