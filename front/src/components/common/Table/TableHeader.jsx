const TableHeader = ({ columns }) => {
    return (
        <tr>
            {columns
                .filter(column => column && typeof column.title !== 'undefined' && typeof column.dataIndex !== 'undefined')
                .map((column, index) => (
                    <th key={index}>{column.title}</th>
                ))}
        </tr>
    );
};

export default TableHeader;

/*const TableHeader = ({columns}) => {
    return (
        <tr>
            {columns.map((column, index) => {
                if (!column) return null
                return <th key={index}>{column.title}</th>
            })}
        </tr>
    );
};

export default TableHeader;*/