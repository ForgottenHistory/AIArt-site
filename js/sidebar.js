function loadContent(pageName) {
    switch (pageName) {
        case 'index':
            window.location.href = '../index.html';
            break;
        case 'prompts':
            window.location.href = 'prompts.html';
            break;
        case 'pixiv':
            window.location.href = 'pixiv.html';
            break;
        case 'deviantart':
            window.location.href = 'deviantart.html';
            break;
        case 'wildcards':
            window.location.href = 'wildcards.html';
            break;
    }
}

function loadContentIndex(pageName) {
    switch (pageName) {
        case 'index':
            window.location.href = 'index.html';
            break;
        case 'prompts':
            window.location.href = 'pages/prompts.html';
            break;
        case 'pixiv':
            window.location.href = 'pages/pixiv.html';
            break;
        case 'deviantart':
            window.location.href = 'pages/deviantart.html';
            break;
        case 'wildcards':
            window.location.href = 'pages/wildcards.html';
            break;
    }
}