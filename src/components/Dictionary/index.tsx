import * as React from 'react';
import './index.scss';

import { Controls } from 'components/Controls';
import { Results } from 'components/Results';

export const Dictionary: React.FC =
    () => (
        <div className={'dictionary'}>
            <Controls/>
            <Results/>
        </div>
    );
