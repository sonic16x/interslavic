import { memo } from 'react'

import { t } from 'translations'

import { expandAbbr, translateAbbr } from 'utils'

import { Hint } from 'components/Hint'

interface IResultsCardPosProps {
    details: string
}

export const ResultsCardPos = memo<IResultsCardPosProps>(({ details }) => (
    <Hint
        title={expandAbbr(t, details)}
        shortTitle={translateAbbr(t, details)}
    />
))

ResultsCardPos.displayName = 'ResultsCardPos'
