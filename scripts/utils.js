import classnames from 'classnames';
export const rankClassNames = rank =>
    classnames('label float-right', {
        'label-success': rank < 102,
        'label-warning': rank > 101 && rank < 500,
        'label-error': rank > 500
    });
