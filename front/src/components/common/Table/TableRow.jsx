import TableRowCell from "./TableRowCell";
const style = {textAlign:'center'}
const TableRow = ({ data, columns }) => {
    return (
        <>
            {data?.length > 0
             ? (data.map((item, index) => {
                    if (!item) return null
                    return <tr key={index}>
                        {columns.map((column, index) => {
                            if (!column) return null
                            return <TableRowCell key={index} item={item} column={column}/>
                        })}
                    </tr>
                }))
                : (<tr>
                    <td colSpan={columns.length} style={style}>Відсутні дані</td>
                </tr>)}
        </>
    );
};

export default TableRow;