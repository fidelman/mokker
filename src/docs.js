const generateTab = (number) => new Array(number).join('  ');

const docArr = (array, result, tabs) => {
    const value = array[0];

    tabs += 1;
    const tabsString = generateTab(tabs);

    if (Array.isArray(value)) {
        result.content.push(`${tabsString}[`);
        docArr(value, result, tabs);
    } else if (typeof value === 'object') {
        result.content.push(`${tabsString}{`);
        docObj(value, result, tabs);
    } else {
        result.content.push(`${tabsString}${typeof value},`);
    }

    result.content.push(`${generateTab(tabs - 1)}]`);
};

const docObj = (obj, result, tabs) => {
    tabs += 1;
    const tabsString = generateTab(tabs);

    for (let key in obj) {
        const value = obj[key];

        if (Array.isArray(value)) {
            result.content.push(`${tabsString}"${key}": [`);
            docArr(value, result, tabs);
        } else if (typeof value === 'object') {
            result.content.push(`${tabsString}"${key}": {`);
            docObj(value, result, tabs);
        } else {
            result.content.push(`${tabsString}"${key}": ${typeof value},`);
        }
    }

    result.content.push(`${generateTab(tabs - 1)}}`);
};

const getParamsFromUrl = (url) => {
    const arrayOfSlashes = url.split('/');
    const arrayOfParams = arrayOfSlashes.filter(item => item.includes(':'));
    const paramsObj = {};
    arrayOfParams.forEach((item) => {
        console.log(item);
        paramsObj[item.replace(':', '')] = '';
    });

    return paramsObj;
};

const getJSONDocs = (stuff, body, url) => {
    const result = {
        language: 'js',
        content: ['{']
    };

    let tabs = 1;

    if (typeof stuff === 'object') {
        docObj(stuff, result, tabs);
    } else {
        const obj = stuff({
            body,
            params: getParamsFromUrl(url)
        });

        docObj(obj, result, tabs);
    }

    return result;
};

const getFileName = (fileName) => {
    return `${fileName.toLocaleLowerCase().replace(new RegExp(' ', 'g'), '-')}.md`;
};

export default (route) => {
    const { docs } = route;

    const file = [
        { h1: docs.title },

        { blockquote: docs.description },

        { h2: 'Method' },
        { p: route.method.toLocaleUpperCase() },
        
        { h2: 'URL' },
        { code: {
            language: 'js',
            content: [route.url]
        }}
    ];

    if (docs.parameters) {
        file.push({ h2: 'Parameters' });
        file.push({ code: getJSONDocs(docs.parameters) });
    }

    if (route.json) {
        file.push({ h2: 'Response' });
        file.push({ code: getJSONDocs(route.json) });
    } else if (route.controller) {
        file.push({ h2: 'Response' });
        file.push({ code: getJSONDocs(route.controller, docs.parameters, route.url) });
    }

    const fileName = getFileName(docs.fileName);

    return {
        fileName,
        file
    }
};
