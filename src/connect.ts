import { connect as originalConnect } from 'react-redux';

export function connect(mapStateToProps, mapDispatchToProps) {
    return (component) =>
        originalConnect(mapStateToProps, mapDispatchToProps, null, {areStatePropsEqual: () => false})(component)
    ;
}
