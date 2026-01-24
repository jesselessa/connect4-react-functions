import Cell from "./Cell.jsx";

const Row = ({ row, play, rowIndex, winningCombination }) => {
    return (
        <tr>
            {row.map((cell, i) => (
                <Cell
                    key={i}
                    value={cell}
                    columnIndex={i}
                    rowIndex={rowIndex}
                    play={play}
                    winningCombination={winningCombination}
                />
            ))}
        </tr>
    );
};

export default Row;
