import classNames from 'classnames';
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dialog-polyfill.css';
import { once } from 'lodash';
import * as React from 'react';
import './index.scss';

interface IModalDialogProps {
    className?: string;
    wrapperClassName?: string;
    children?: any;

    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

interface IModalDialogState {
    open: boolean;
}

class ModalDialog extends React.Component<IModalDialogProps, IModalDialogState> {
    public state = { open: this.props.open };

    private dialogRef = React.createRef<HTMLDialogElement>();

    public componentDidUpdate(prevProps: Readonly<IModalDialogProps>, prevState: Readonly<IModalDialogState>): void {
        if (!this.state.open && this.props.open > prevProps.open) {
            this.showModal();
        }

        if (this.state.open && this.props.open < prevProps.open) {
            this.close();
        }
    }

    public componentDidMount() {
        const dialogElement = this.dialogRef.current;

        if (dialogElement) {
            dialogPolyfill.registerDialog(dialogElement);
            dialogElement.addEventListener('cancel', this.onDialogCancelListener);
            dialogElement.addEventListener('close', this.onDialogCloseListener);
        }

        if (this.state.open) {
            this.showModal();
        }
    }

    public componentWillUnmount() {
        const dialogElement = this.dialogRef.current;

        if (dialogElement) {
            dialogElement.removeEventListener('cancel', this.onDialogCancelListener);
            dialogElement.removeEventListener('close', this.onClose);
        }
    }

    public render() {
        return (
            <dialog
                ref={this.dialogRef}
                className={classNames('modal-dialog', this.props.className)}
                role={'dialog'}
                onClick={this.onBackdropClick}
            >
                <div
                    role={'document'}
                    className={classNames(this.props.wrapperClassName)}
                    onClick={this.onContentClick}
                >
                    {this.props.children}
                </div>
            </dialog>
        );
    }

    public showModal = () => {
        const dialog = this.dialogRef.current;

        if (dialog) {
            dialog.showModal();
            this.setState({ open: true }, this.onOpen);
        }
    }

    public close = (returnValue?: string) => {
        const dialog = this.dialogRef.current;

        if (dialog) {
            const onAnimationEnd = once(() => {
                dialog.classList.remove('closing');
                dialog.close(returnValue);
                dialog.removeEventListener('webkitAnimationEnd',  onAnimationEnd, false);
                dialog.removeEventListener('animationend',  onAnimationEnd, false);
            });

            dialog.addEventListener('animationend', onAnimationEnd, false);
            dialog.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
            dialog.classList.add('closing');
        }
    }

    // should handle only backdrop clicks, since onContentClick stops propagation
    private onBackdropClick = () => {
        this.close();
    }

    private onContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    private onOpen = () => {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    private onClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private onDialogCancelListener = (e: Event) => {
        e.preventDefault();
        this.close();
    }

    private onDialogCloseListener = () => {
        this.state.open = false; // sync state ad-hoc
        this.setState({open: false}, this.onClose);
    }
}

export default ModalDialog;
