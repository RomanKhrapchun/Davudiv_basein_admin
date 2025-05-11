const TableHeader = ({columns}) => {
    return (
        <tr>
            {columns.map((column, index) => {
                if (!column) return null
                return <th key={index}>{column.title}</th>
            })}
        </tr>
    );
};

export default TableHeader;