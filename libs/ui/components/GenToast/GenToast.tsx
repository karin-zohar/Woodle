import type { FC } from 'react';
import './gen-toast.style.css';
import type { ToastType } from '@/libs/hooks/useToast/useToast';

type GenToastProps = {
    text: string;
    type: ToastType;
};

const GenToast: FC<GenToastProps> = ({ text, type }) => {

    return (
        <div className="gen-toast wood-grain">
            <div className={`gen-toast-message ${type}`}>
                <span className="gen-toast-message-text">{text}</span>
            </div>
        </div>
    );
};

export default GenToast;
