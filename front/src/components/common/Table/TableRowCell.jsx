const TableRowCell = ({item, column}) => {

    return (
            <td>{column.render ? column.render(column, item) : item[column?.dataIndex]}</td>
    );
};

export default TableRowCell;