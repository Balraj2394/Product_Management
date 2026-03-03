import React from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-icon">⚠️</div>
                <h3 className="dialog-title">{title}</h3>
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="btn-loading">
                                <span className="spinner"></span>
                                Deleting...
                            </span>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
