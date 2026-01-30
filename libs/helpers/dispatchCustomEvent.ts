const dispatchCustomEvent = <T,>(eventName: string, payload?: T): void => {
  const event = new CustomEvent(eventName, {
    detail: payload,
    cancelable: true,
  });

  window.dispatchEvent(event);
};

export default dispatchCustomEvent;
