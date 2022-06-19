import { t } from "translations";

export function getIntelligibilityReport(lang: string, sameInLanguages: string) {
    const record = sameInLanguages.split(' ').find(w => w.includes(lang));

    const result = {
        emoji: '🔴',
        status: t('nonIntelligibleStatus'),
        verified: true,
    };

    if (record) {
        if (record.startsWith('~')) {
            result.emoji = '🟡'
            result.status = t('quasiIntelligibleStatus')
        } else {
            result.emoji = '🟢'
            result.status = t('intelligibleStatus')
        }

        if (record.startsWith('?') || record.startsWith('#')) {
            result.emoji += '🐍';
            result.status += ` + ${t('falseFriend')}`;
        }

        result.verified = !record.endsWith('!');
        if (result.verified) {
            result.status = `(${t('verified')}) ${result.status}`;
        }
    }

    return result;
}
