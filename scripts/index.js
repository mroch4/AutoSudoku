import arrays from './arrays.js'

const board = $('#board')
const iteration = $('#iteration')
const info = $('#info')
const defaultSet = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const randomNumber = Math.floor(arrays.length * Math.random())

let array = []
let clicks = 0
let helper = null

$(function () {
    helper = arrays[randomNumber]
    array = helper.initial
    info.text(`${helper.level} ${helper.iterations ?
        `(achivable in ${helper.iterations} clicks)` :
        '(not achivable)'}`)
    renderBoard()
})

window.onClickHandler = (elem, row, col) => {
    toggleHighlight(elem, 'marked')
    filterValues(row, col)
}

window.autoFill = () => {
    for (let i = 0; i < array.length; i++) {
        const row = array[i]
        for (let j = 0; j < row.length; j++) {
            if (array[i][j] === 0) {
                filterValues(i, j)
            }
        }
    }
    updateIteration()
}

const updateIteration = () => {
    if (clicks == helper.iterations) {
        $('#button').prop('disabled', true)
    } else {
        clicks++
        iteration.text(clicks)
    }
}

const toggleHighlight = (elem, className) => {
    $(`.${className}`).removeClass(className)
    $(elem).addClass(className)
}

const colToArray = (col) => {
    let colArray = []
    for (let i = 0; i < array.length; i++) {
        colArray.push(array[i][col])
    }
    return colArray
}

const getArea = (loc) => {
    switch (loc) {
        case 0:
        case 1:
        case 2:
            return 0
        case 3:
        case 4:
        case 5:
            return 3
        case 6:
        case 7:
        case 8:
            return 6
    }
}

const getSquareArray = (row, col) => {
    const rowTrimStart = getArea(row)
    const colTrimStart = getArea(col)

    const arr = array
        .slice(rowTrimStart, rowTrimStart + 3)
        .map(row => row.slice(colTrimStart, colTrimStart + 3))
        .reduce((a, b) => a.concat(b), [])

    return arr
}

const insertValue = (row, col, val) => {
    array[row][col] = val
    renderBoard()
}

const filterValues = (row, col) => {
    let arr = []

    const rowArr = array[row]
    const colArr = colToArray(col)
    const squareArr = getSquareArray(row, col)

    defaultSet.map(item => {
        if (rowArr.includes(item) || colArr.includes(item) || squareArr.includes(item)) return
        arr.push(item)
    })

    const arrLength = arr.length
    if (arrLength === 1) {
        insertValue(row, col, arr[0])
    }
    // if (arrLength === 2) {
    //     console.log(`Row: ${row}, Col: ${col}: ${arr}`)
    // }
}

const EmptyCellComponent = (row, col) => {
    return `<span class="cell" onclick="onClickHandler(this, ${row}, ${col})"></span>`
}

const CellComponent = (val) => {
    return `<span class="cell">${val}</span>`
}

const renderBoard = () => {
    let item
    board.empty()
    array.map((row, rowIndex) => {
        row.map((value, colIndex) => {
            if (value === 0) {
                item = EmptyCellComponent(rowIndex, colIndex)
            } else {
                item = CellComponent(value)
            }
            board.append(item)
        })
    })
}