function insertBooks(booksSelectId) {
    var booksSelect = document.getElementById(booksSelectId)
    loadJSON('./books.json', function (response) {
        var booksJSON = JSON.parse(response)
        for (let i = 0; i < booksJSON.books.length; i++) {
            const book = booksJSON.books[i];
            if (i == 0) {
                insertGroup(booksSelect, 'st')
            } else if (i == 39) {
                insertGroup(booksSelect, 'nt')
            }
            insertBookOption(book)
        }
        booksSelect.selectedIndex = 39  // select Mat
    })
}

function insertChapters(chaptersSelectId, booksSelectId) {
    var chaptersSelect = document.getElementById(chaptersSelectId)
    var booksSelect = document.getElementById(booksSelectId)

    removeChapters(chaptersSelect)

    loadJSON('./books.json', function (response) {
        var booksJSON = JSON.parse(response)
        let currentBook = booksSelect.value
        for (let i = 0; i < booksJSON.books.length; i++) {
            const book = booksJSON.books[i];
            if (book.index == currentBook) {
                for (let j = 0; j < book.chapters; j++) {
                    let option = document.createElement('option')
                    option.value = j + 1
                    option.innerText = j + 1
                    chaptersSelect.appendChild(option)
                }
                chaptersSelect.selectedIndex = 0
                break
            }
        }
    })
}

function changeAudioSrc(player, booksSelect, chaptersSelect) {
    player.stop()
    player.source = {
        type: 'audio',
        sources: [
            {
                src: 'https://www.wordproaudio.org/bibles/app/audio/33/' + booksSelect.value + '/' + chaptersSelect.value + '.mp3',
                type: 'audio/mp3'
            }
        ]
    }
    player.pause()
}

function changeAudioSrcWhenReady(booksSelectId, chaptersSelectId) {
    var booksSelect = document.getElementById(booksSelectId)
    var chaptersSelect = document.getElementById(chaptersSelectId)

    var checkReadyState = setInterval(() => {
        if (booksSelect.value != "" && chaptersSelect.value != "") {
            clearInterval(checkReadyState)
            changeAudioSrc(player, booksSelect, chaptersSelect)
        }
    }, 10)
}

window.onload = function () {
    this.insertBooks('books')
    this.insertChapters('chapters', 'books')

    this.changeAudioSrcWhenReady('books', 'chapters')
}


function loadJSON(path, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function insertGroup(select, label) {
    let optgroup = document.createElement('optgroup')
    optgroup.id = label
    if (label == 'st') {
        optgroup.label = 'Stary Testament'
    } else {
        optgroup.label = 'Nowy Testament'
    }
    select.appendChild(optgroup)
}

function insertBookOption(book) {
    let option = document.createElement('option')
    option.name = book.short
    option.value = book.index
    option.innerText = book.name
    document.getElementById(book.part).appendChild(option)
}

function removeChapters(select) {
    while (select.length > 0) {
        select.remove(select.selectedIndex)
    }
}
