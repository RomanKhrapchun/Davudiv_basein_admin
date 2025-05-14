const TableRowCell = ({ item, column }) => {
    if (!column || !column.dataIndex) return <td />;

    const value = item[column.dataIndex];

    return (
        <td>
            {column.render
                ? column.render(value, item)
                : (typeof value !== 'undefined' ? value : null)
            }
        </td>
    );
};

export default TableRowCell;

/*const TableRowCell = ({item, column}) => {

    return (
            <td>{column.render ? column.render(column, item) : item[column?.dataIndex]}</td>
    );
};

export default TableRowCell;*/