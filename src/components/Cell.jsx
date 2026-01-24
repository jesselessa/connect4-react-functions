const Cell = ({ value, columnIndex, rowIndex, play, winningCombination }) => {
    // 1. Set cell color based on player value
    let color = "white";
    if (value === 1) color = "red";
    else if (value === 2) color = "yellow";

    // 2. Check if this is a winning cell
    const isWinningCell = winningCombination.some(
        (coord) => coord[0] === rowIndex && coord[1] === columnIndex
    );

    // 3. Determine 'drop' class for animation
    const dropClass = value ? "drop" : "";

    return (
        <td>
            <div className="cell" onClick={() => play(columnIndex)}>
                {/* Cell white hole (empty cell) */}
                <div className="white"></div>

                {/* Player's token with color, animation, and winning highlight */}
                <div className={`
            ${color} 
            ${dropClass} 
            ${isWinningCell ? "orange" : ""}
        `}></div>
            </div>
        </td>
    );
};

export default Cell;
