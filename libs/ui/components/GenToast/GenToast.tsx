import type { FC } from 'react';
import './gen-toast.style.css';
import type { ToastType } from '@/libs/hooks/useToast/useToast';

type GenToastProps = {
    text: string;
    type: ToastType;
    successfulGuess?: number;
};

const GAME_OVER_MESSAGES: Record<number, string> = {
    1: 'Genius',
    2: 'Magnificent',
    3: 'Impressive',
    4: 'Splendid',
    5: 'Great',
    6: 'Phew',
};

const GenToast: FC<GenToastProps> = ({ text, type, successfulGuess }) => {
    const getAutoMessage = () => {
        if (type === 'info' && successfulGuess) {
            return GAME_OVER_MESSAGES[successfulGuess] ?? 'Game Over';
        }
        return '';
    };

    const displayText = text ?? getAutoMessage();

    return (
        <div className="gen-toast">
            <div className={`gen-toast-message ${type}`}>
                <span className="gen-toast-message-text">{displayText}</span>
            </div>
        </div>
    );
};

export default GenToast;
