import type { FC } from 'react';
import './gen-toast.style.css';
import type { ToastType } from '@/libs/hooks/useToast/useToast';
import useStore from '@/store/store';
import clsx from 'clsx';

type GenToastProps = {
    text: string;
    type: ToastType;
};

const GenToast: FC<GenToastProps> = ({ text, type }) => {
    const { theme } = useStore();
    return (
        <div className={clsx('gen-toast', 'wood-grain')}>
            <div className={clsx('gen-toast-message', type, 'theme', theme)}>
                <span className="gen-toast-message-text">{text}</span>
            </div>
        </div>
    );
};

export default GenToast;
