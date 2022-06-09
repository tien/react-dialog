import useMergedRef from '@react-hook/merged-ref';
import React, {useEffect, useRef} from 'react';

export type DialogProps = React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
> & {
  isModal?: boolean;
  onClickBackdrop?: () => unknown;
};

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  // eslint-disable-next-line react/prop-types
  function Dialog({open, isModal, onClickBackdrop, ...props}, ref) {
    const innerRef = useRef<HTMLDialogElement>();
    const mergedRef = useMergedRef(ref, innerRef);

    useEffect(() => {
      if (open) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (innerRef.current?.open === false) {
          if (isModal) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            innerRef.current?.showModal();
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            innerRef.current?.show();
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (innerRef.current?.open) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          innerRef.current?.close();
        }
      }
    }, [isModal, open]);

    useEffect(() => {
      const listener = function (this: HTMLDialogElement, event: MouseEvent) {
        const rect = this.getBoundingClientRect();
        if (
          event.clientY < rect.top ||
          event.clientY > rect.bottom ||
          event.clientX < rect.left ||
          event.clientX > rect.right
        ) {
          onClickBackdrop?.();
        }
      };

      const dialog = innerRef.current;

      dialog?.addEventListener('click', listener);

      return () => dialog?.removeEventListener('click', listener);
    }, [onClickBackdrop]);

    return (
      <dialog ref={mergedRef} {...props} open={isModal ? undefined : open} />
    );
  }
);

export default Dialog;
