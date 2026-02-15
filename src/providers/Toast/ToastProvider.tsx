import {
	createContext,
	useContext,
	useCallback,
	type FC,
	type ReactNode,
} from 'react';
import { App } from 'antd';
import GenToast from '@/libs/ui/components/GenToast/GenToast';
import type { ToastType } from '@/libs/hooks';

type ToastContextType = {
	contextHolder: ReactNode;
	showToast: (type: ToastType, text: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const removeDefaultIcon = <span style={{ display: 'none' }} />;

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { message: messageApi } = App.useApp();

	const showToast = useCallback(
		(type: ToastType, text: string) => {
			messageApi.open({
				className: 'gen-toast-wrapper',
				type,
				content: <GenToast text={text} type={type} />,
				icon: removeDefaultIcon,
				duration: 4,
			});
		},
		[messageApi]
	);

	const value: ToastContextType = {
		showToast,
		contextHolder: null,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
		</ToastContext.Provider>
	);
};

export const useToastContext = () => {
	return useContext(ToastContext);
};
