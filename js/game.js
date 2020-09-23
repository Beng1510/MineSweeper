'use strict';

const MINE = '💣'
const BOOM = '💥'
const EMPTY_CELL = ''

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gBoardSize = 4;

var gBoard;
var gCells = []
// console.log('gCells', gCells);

// var cell = {
//     minesAroundCount: 4,
//     isShown: true,
//     isMine: false,
//     isMarked: true
// }

gBoard = buildBoard();
renderBoard(gBoard)

function initGame() {

}

function buildBoard(board) {
    var board = []
    for (var i = 0; i < gBoardSize; i++) {
        board[i] = [];
        for (var j = 0; j < gBoardSize; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false,
                gameElement: ''
            }
            board[i][j] = cell
        }
        // board.push(row)
    }
    board[0][3].isMine = true;
    board[2][1].isMine = true;
    // console.log('board',board);
    console.log('boardmine', board[2][1]);

    return board
}
console.log('gBoard', gBoard);


function renderBoard(board) {

    var htmlStr = '';
    for (var i = 0; i < (board.length); i++) {
        // var row = board[i];
        htmlStr += '<tr>';
        // var row = board[i];
        for (var j = 0; j < (board.length); j++) {
            // var cell = row[j];
            var currCell = board[i][j];
            var className = (currCell === MINE || currCell === BOOM) ? 'dead' : '';
            // var tdId = 'cell-' + i + '-' + j;
            //    if (curr)
           var cell = currCell.minesAroundCount
            var posStr = i + '-' + j;
            var tdId = 'cell-' + i + '-' + j;
            // var numberOfMines = currCell.minesAroundCount
            htmlStr += '<td id="' + tdId + 'class="' + className + '" data-pos="' + posStr + '" onclick="cellClicked(this)">';
            if (currCell.isMine === true) {
                htmlStr += MINE;
            }
            
            // htmlStr += currCell.minesAroundCount
            
            // + cell + '</td>';
            // + cell + 
            '</td>';
        }
        htmlStr += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = htmlStr;

    // var elCell = document.querySelector('board')
    // elCell.innerHTML = currCell.minesAroundCount

}
function cellClicked(elCell, i, j) {
    console.log('clicked elCell', elCell);
    // var cellCoord = getCellCoord(elCell.id);
    // console.log('cellCoord',cellCoord);
    var pos = getPosFromElTd(elCell);

    var cell = gBoard[pos.i][pos.j];
    console.log('clicked cell', cell);
    console.log('position', pos);
    cell.location = pos
    console.log('added cell.location', cell);
    console.log('gboard after', gBoard);

    if (cell.isMine === true) {
        elCell.innerText = BOOM;
    }
    if (cell.isMine === false) {
        cell.minesAroundCount = setMinesNegsCount(gBoard, pos);

      

        console.log('number of mines around:', cell.minesAroundCount, 'at location', pos);
    } else { console.log('BLOWN UP') };
    // elCell.innerText = cell.minesAroundCount
    // if (gBoard[pos.i][pos.j].minesAroundCount === true) 
if (cell.isMine === false) {
    elCell.innerText = cell.minesAroundCount
    
}

    // if (cell.minesAroundCount === 0) {
    //     elCell.innerText = ''
    // }


}

function getPosFromElTd(elCell) {
    var dataSet = elCell.dataset;
    var posStr = dataSet.pos;
    var splitted = posStr.split('-');
    var pos = { i: +splitted[0], j: +splitted[1] };
    console.log('pos', pos);
    return pos;
}
// function getCellCoord(strCellId) {
//     // console.log(strCellId);
//     var coord = {};
//     var parts = strCellId.split('-');
//     coord.i = +parts[1]
//     coord.j = +parts[2];
//     console.log('coord',coord);
//     // gBoard.location[i][j] = {};
//     // gBoard[i][j].location.i = coord.i
//     // gBoard.location.j = coord.j
//     // console.log('gboard checking location',gBoard );
//     return coord;
// }
console.log('board[0][2]', gBoard[0][2]);


function setMinesNegsCount(board, pos) {
    // debugger
    var count = 0;
    if (board[pos.i][pos.j].isMine === true) {
        console.log('cant go in'); return;
    }
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === pos.i && j === pos.j) continue;
            
            if (board[i][j].isMine === true) {
                count++;
                // console.log('counting after',board[i][j].minesAroundCount);
            }
            board[pos.i][pos.j].minesAroundCount = count
            console.log('cell.minesAroundCount', board[pos.i][pos.j].minesAroundCount);
            board[pos.i][pos.j].innerHTML === count
        }
        // renderCell(board[i][j], count)
    }
    return count;

    // function renderCell(pos, value) {
    //     var posStr = pos.i + '-' + pos.j;
    //     var elTd = document.querySelector('[data-pos="'+posStr+'"]');
        
    //     elTd.innerText = value+'';
    // }

}


function cellMarked(elCell) {


}

function checkGameOver() {


}

function expandShown(board, elCell, i, j) {


}

