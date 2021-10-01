
import './index.scss';
import classNames from 'classnames';
import { t } from 'translations';
import { useLoading } from 'hooks/useLoading';
import { Spinner } from 'components/Spinner';

export const Loader =
    () => {
        const loading = useLoading();

        return (
            <div className={classNames('loader', {loading})}>
                <Spinner
                    size={'4rem'}
                    borderWidth={'.3em'}
                />
                <span className={'loader__title'}>{t('loading')}</span>
            </div>
        );
    };
