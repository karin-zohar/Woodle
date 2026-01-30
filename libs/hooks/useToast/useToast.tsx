import { type ReactNode, useCallback } from 'react';
import { message } from 'antd';
import GenToast from '@/libs/ui/components/GenToast/GenToast';
import { useToastContext } from '@/providers/Toast/ToastProvider';

export type ToastType = 'success' | 'error' | 'info';

export type UseToastReturnType = {
	contextHolder: ReactNode;
	showToast: (type: ToastType, text: string) => void;
};

const useToast = (): UseToastReturnType => {
	const toastContext = useToastContext();
	if (toastContext) {
		return toastContext;
	}

	const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });

	const removeDefaultIcon = <span style={{ display: 'none' }}></span>;

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

	return { contextHolder, showToast };
};

export default useToast;
