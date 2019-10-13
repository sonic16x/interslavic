import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';
import Table from 'components/Table';

interface IGrammarProps {
    close: () => void;
    isVisible: boolean;
}

class Grammar extends React.Component<IGrammarProps> {
    public render() {
        const table1 = [
            [
                '&nbsp@bt#bl',
                'jednina@w=2#d',
                'množina@w=2#d',
                'dvojina@w=2#d',
            ],
            [
                'N@d#bb',
                'brat@br',
                'grad@bb#bl',
                'brat-{i}b@br#g',
                'grad-{y}b@bb#bl#g',
                'brat-{a}r@br#bb',
                'grad-{a}r@bl#bb',
            ],
            [
                'A@d#bb',
                'brat-{a}r@bb#b',
                'grad',
                'brat-{o}pv@bb#B',
                'grad-{y}b@bt#g',
                'brat-{u}p@br#bt',
                'grad-{a}r@bl#bt',
            ],
            [
                'G@d#bb',
                'brat-{a}r@br#b',
                'grad-{a}r@bl#b',
                'brat-{o}pv@br#B',
                'grad-{o}pv@bl#B',
                'brat-{u}p@br#bb#b',
                'grad-{u}p@bl#bb#b',
            ],
            [
                'L@d#bb',
                'brat-{u}p@br#bb#g',
                'grad-{u}p@bl#bb#g',
                'brat-{a}rh@br#G',
                'grad-{a}rh@bl#G',
                'brat-{u}p@br#bt#b',
                'grad-{u}p@bl#bt#b',
            ],
            [
                'D@d#bb',
                'brat-{u}p@br#bt#g',
                'grad-{u}p@bl#bt#g',
                'brat-{a}rm@br#R#bb',
                'grad-{a}rm@bl#R#bb',
                'brat-{a}rm{a}r@br#bb#r',
                'grad-{a}rm{a}r@bl#bb#r',
            ],
            [
                'I@d',
                'brat-{o}pm@br#r',
                'grad-{o}pm@bl#r',
                'brat-{a}rm{i}b@br#R#bt',
                'grad-{a}rm{i}b@bl#R#bt',
                'brat-{a}rm{a}r@br#bt#r',
                'grad-{a}rm{a}r@bl#bt#r',
            ],
            [
                'V@d',
                'brat-{e}g!@br#g',
                'grad-{e}g!@bl#g',
                'brat-{i}b!@br#G',
                'grad-{y}b!@bl#G',
                'brat-{a}r!@br#g',
                'grad-{a}r!@bl#g',
            ],
        ];
        return (
            <div className={'container grammar' + (this.props.isVisible ? ' show' : '')}>
                <h4>MEDŽUSLOVJANSKY JEZYK</h4>
                <p>abeceda i pravopisanje</p>
                <Table data={table1}/>
            </div>
        );
    }
}

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'grammar' && !isLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(setPageAction('translator')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Grammar);
