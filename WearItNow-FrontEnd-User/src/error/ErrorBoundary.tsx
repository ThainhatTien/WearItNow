import React, {Component, ErrorInfo} from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode; // Định nghĩa kiểu cho children
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage?: string; // Thêm để lưu thông tin lỗi
    errorStack?: string; // Thêm để lưu stack trace
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {
        return {hasError: true, errorMessage: error.message};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Lỗi bị bắt bởi ErrorBoundary:", error);
        console.error("Thông tin lỗi:", errorInfo.componentStack);

        // Lưu thông tin stack để sử dụng trong render
        this.setState({
            errorStack: errorInfo.componentStack || "Không có thông tin stack",
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Đã có sự cố xảy ra.</h1>
                    <p>
                        <strong>Thông báo lỗi:</strong> {this.state.errorMessage}
                    </p>
                    <pre>
            <strong>Stack Trace:</strong> {this.state.errorStack}
          </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
