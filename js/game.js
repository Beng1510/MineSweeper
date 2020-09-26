const FLAG = '🎌';
const MINE = '💣';
const WINNER = '🌞';
const PLAYER = '😊';
const LOSER = '😭';
const HINT = '💡';


var gIsTimerOn = false;

var gElGameOver = document.querySelector('.game-over')
var gElWinner = document.querySelector('.winner')
var elMood = document.querySelector('.smiley-container');

var gMinePlaced;


var gBoard;


var gTimer;

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gSize = gLevel.SIZE

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
// var gBoardSize = 4;
var gBoardFlagCount;
var gBoardMineCount;
var gBoard;
var gCells = []
var elFlagCounter = document.querySelector(".flag-counter");
var elMineCounter = document.querySelector(".mine-counter");




function initGame() {
    gBoard = buildBoard(gBoard, gSize);
    renderBoard(gBoard, '.game-board');
    elMood.innerHTML = PLAYER;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gElGameOver.style.display = 'none';
    gElWinner.style.display = 'none'
    endTime()
    renderTime()
    console.log('begin board', gBoard);
}



function buildBoard(board, size) {
    board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                location: {
                    i: i,
                    j: j
                },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

console.log('gBoard', gBoard);


function renderBoard(board, selector) {
    var strHTML = '<table class="table"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elboard = document.querySelector(selector);
    elboard.innerHTML = strHTML;
    console.log('rendered board:', gBoard);
}




function cellClicked(elCell, i, j) {
    console.log('clicked elCell', elCell);
    // var cellCoord = getCellCoord(elCell.id);
    // console.log('cellCoord',cellCoord);

    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) {
        console.log('cell is flagged');
        return
    };
    if (gGame.shownCount === 0) {  /// first clicked cell
        renderMine(gBoard, i, j)
        countMines()
        startTime()
        console.log('new board after mines set', gBoard);

    }
    var elCell = document.querySelector(`.cell-${i}-${j}`)



    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++
        if (gBoard[i][j].isMine) {
            revealMines()
            elCell.style.backgroundColor = 'red'
            console.log('BOOM GAME OVER');
            gGame.isOn = false
            gElGameOver.style.display = 'block';

        } else if (gBoard[i][j].minesAroundCount > 0) {
            elCell.innerHTML = gBoard[i][j].minesAroundCount
            elCell.style.backgroundColor = 'lightseagreen'


        } else {
            checkEmptyNegs(i, j)
            elCell.style.backgroundColor = 'lightseagreen'
        }
    }
    checkGameOver()


    var neighbours = getNegsId(elCell.id)
    console.log('neighbors', neighbours);

    var pos = getPosFromElId(elCell);
    var cell = gBoard[pos.i][pos.j];

    // var pos = getCellCoord(elCell.id);
    // var cell = gBoard[pos.i][pos.j];
    // console.log('cell',cell);

    console.log('clicked cell', cell);
    console.log('position', pos);
    cell.location = pos

    console.log('gboard after', gBoard);

    if (cell.isMine === false) {
        cell.minesAroundCount = setMinesNegsCount(gBoard, pos);

        console.log('number of mines around:', cell.minesAroundCount, 'at location', pos);
    }



}


function renderMine(board, i, j) {

    var firstMine = {
        i: i,
        j: j
    }
    console.log('first cell clicked:', firstMine);
    var minesCount = gLevel.MINES;
    while (minesCount > 0) {
        var mineCoord = {
            i: getRandomInt(0, gLevel.SIZE),
            j: getRandomInt(0, gLevel.SIZE)
        }
        var i = mineCoord.i;
        var j = mineCoord.j;
        if (firstMine.i === mineCoord.i && firstMine.j === mineCoord.j) continue; // first click wont be a mine
        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            minesCount--
            console.log('random mine set at:', i, j);
        }
    }
}


function getPosFromElId(elCell) {
    var dataSet = elCell.dataset;
    var posStr = dataSet.pos;
    var splitted = posStr.split('-');
    var pos = { i: +splitted[0], j: +splitted[1] };
    console.log('pos', pos);
    return pos;
}

function getNegsId(id) {
    var row = parseInt(id[0]);
    var column = parseInt(id[1]);
    var neighbors = [];
    neighbors.push((row - 1) + '' + (column - 1));
    neighbors.push((row - 1) + '' + (column));
    neighbors.push((row - 1) + '' + (column + 1));
    neighbors.push((row) + '' + (column - 1));
    neighbors.push((row) + '' + (column + 1));
    neighbors.push((row + 1) + '' + (column - 1));
    neighbors.push((row + 1) + '' + (column));
    neighbors.push((row + 1) + '' + (column + 1));

    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].length > 2) {
            neighbors.splice(i, 1);
            i--;
        }
    }
    return neighbors;
}

function getCellCoord(strCellId) {
    // console.log(strCellId);
    var pos = {};
    var parts = strCellId.split('-');
    // 
    pos.i = +parts[1]
    pos.j = +parts[2];
    return pos;
}




function cellMarked(elCell, i, j) {
    window.event.returnValue = false;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        startTime();
    }
    isMineMarked()

    var elCell = document.querySelector(`.cell-${i}-${j}`)

    // debugger
    if (!gBoard[i][j].isMarked && gGame.markedCount < gLevel.MINES) {
        if (elCell.innerHTML === '') {
            gBoard[i][j].isMarked = true;
            gGame.markedCount++
            gBoardFlagCount--
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.innerHTML = FLAG;
        }

    } else if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--
        gBoardFlagCount++
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.innerHTML = '';
    }

    console.log('gGame.markedCount', gGame.markedCount);
    console.log(' gBoardFlagCount', gBoardFlagCount);

    elFlagCounter.innerText = 'Number of Flags Available: ' + gBoardFlagCount;

    checkGameOver()

    // if (gBoard[i][j].isShown === false && gBoardFlagCount !== 0) {
    //     if (!gBoard[i][j].isMarked) {
    //         gBoard[i][j].isMarked = true
    //         elCell.innerText = FLAG;

    //         gBoardFlagCount--
    //         // if (gBoardMineCount !== 0)
    //         // gBoardMineCount--
    //         // console.log('gBoardFlagCount',gBoardFlagCount);


    //         // elMineCounter.innerText = 'Number of Mines to Find: ' + gBoardMineCount;
    //     } else {
    //         gBoard[i][j].isMarked = false
    //         elCell.innerText = '';
    //         gBoardFlagCount++
    //     }
    //     elFlagCounter.innerText = 'Number of Flagged Cells: ' + gBoardFlagCount;
    //     // if (gBoardFlagCount === 0) {
    //     //     console.log('no more flags');
    //     // }
    // }
}



function setMinesNegsCount(negsI, negsJ) {
    var count = 0;
    for (var i = negsI - 1; i <= negsI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = negsJ - 1; j <= negsJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length || i === negsI && j === negsJ) continue;
            var currItem = gBoard[i][j];
            if (currItem.isMine) count++;
        }
    }
    gBoard[negsI][negsJ].minesAroundCount = count;
}


function countMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            setMinesNegsCount(i, j)
        }


    }
    renderBoard(gBoard, '.game-board')
}



function checkEmptyNegs(positionI, positionJ) {
    for (var i = positionI - 1; i <= positionI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = positionJ - 1; j <= positionJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length || i === positionI && j === positionJ) continue;
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.style.backgroundColor = 'lightseagreen'
                elCell.innerHTML = (currCell.minesAroundCount > 0) ? currCell.minesAroundCount : ''
                currCell.isShown = true;
                gGame.shownCount++

            }
        }
    }
}


function isMined(board, row, column) {
    var cell = board[row + '' + column];
    var isMine = 0
    if (typeof cell !== 'undefined') {
        isMine = cell.mined ? 1 : 0;
    }
    return isMine
}

function getNegsCounter(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === pos.i && j === pos.j) continue;

            var cell = board[i][j];
            if (cell.isMine === false) {
                board[i][j] = cell.minesAroundCount;

                var currPos = { i: i, j: j };
                renderCell(currPos, cell.minesAroundCount);
            }
        }
    }
}










function randomSetMines(board, mineCount) {
    // debugger
    var mineCoords = [];
    for (var i = 0; i < mineCount; i++) {
        var ranRowCoord = getRandomInt(0, gLevel.SIZE);
        var ranColCoord = getRandomInt(0, gLevel.SIZE);
        console.log('RowCoord', ranRowCoord);
        console.log('ColCoord', ranColCoord);
        // var cell = ranRowCoord + "" + ranColCoord;
        var pos = { i: ranRowCoord, j: ranColCoord };
        console.log('random mine position:', pos);
        // mineCoords.push(pos);
        while (mineCoords.includes(pos)) {
            ranRowCoord = getRandomInt(0, gLevel.SIZE);
            ranColCoord = getRandomInt(0, gLevel.SIZE);
            //     // cell = ranRowCoord + "" + ranColCoord;
            pos = { i: ranRowCoord, j: ranColCoord };
        }
        console.log('mineCoords', mineCoords);
        gBoard[ranRowCoord][ranColCoord].isMine = true


        console.log('gBoard[pos.i][pos.j]', gBoard[pos.i][pos.j]);

        // if (!mineCoords.includes(pos));
        mineCoords.push(pos);
        // console.log(cell);
        // console.log(mineCoords);
        // board[cell].isMine = true;
        // }

    }
    return board
}
function renderCell(pos, value) {
    var posStr = pos.i + '-' + pos.j;
    var elTd = document.querySelector('[data-pos="' + posStr + '"]');
    elTd.innerText = value;
}


function chooseLevel(level) {
    if (level.value === 'Easy') {
        gLevel = {
            SIZE: 4,
            MINES: 2,
        }
    } else if (level.value === 'Medium') {
        gLevel = {
            SIZE: 8,
            MINES: 12,
        }
    } else {
        gLevel = {
            SIZE: 12,
            MINES: 30,
        }
    }

    gBoardFlagCount = gLevel.MINES;
    gBoardMineCount = gLevel.MINES;
    // var elFlagCounter = document.querySelector(".flag-counter");
    elFlagCounter.innerText = 'Number of Flags Available: ' + gBoardFlagCount;
    elMineCounter.innerText = 'Number of Mines to Find: ' + gBoardMineCount;

    initGame();
    gBoard = buildBoard(gBoard, gLevel.SIZE);
    renderBoard(gBoard, '.game-board');
    console.log('resized board:', gBoard);
}


function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                currCell.isShown = true
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerHTML = MINE
                elCell.style.backgroundColor = 'red'


            }
        }
    }
}

function isMineMarked() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine && currCell.isMarked) {
                count++;
            }
        }
    }
    if (count === gLevel.MINES) {
        return true;
    } else {
        return false;
    }
}





function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount >= (gLevel.SIZE * gLevel.SIZE - gLevel.MINES)) {
        elMood.innerHTML = WINNER
        gGame.isOn = false
        gElWinner.style.display = 'block'
        endTime()
    } else if (gGame.isOn === false) {
        elMood.innerHTML = LOSER
        // gElGameOver.style.display = 'none';
        endTime()
    }

}




function revealCell(coord) {
    var cell = gBoard[coord.i][coord.j];
    cell.isShown = true;
    var elCell = document.getElementById('cell')
    // elCell.classList.remove('hide');
    // elCell.classList.add('show');
    elCell.innerText = cell.isMine ? MINE : (cell.minesAroundCount ? cell.minesAroundCount : '000');
}


function startTime() {
    gTimer = setInterval(() => {
        gGame.secsPassed++
        renderTime();
    }, 1000);
}


function endTime() {
    clearInterval(gTimer);
}