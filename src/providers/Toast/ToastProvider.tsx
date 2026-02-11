import { createContext, useContext, type  FC, type ReactNode, } from 'react';
import { useToast } from '@/libs/hooks';

type ToastContextType = ReturnType<typeof useToast>;

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const toast = useToast();

	return (
		<ToastContext.Provider value={toast}>
			{toast.contextHolder}
			{children}
		</ToastContext.Provider>
	);
};

export const useToastContext = () => {
	return useContext(ToastContext);
};
