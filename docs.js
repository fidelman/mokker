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

const getJSONDocs = (obj) => {
    const result = {
        language: 'js',
        content: ['{']
    };

    let tabs = 1;

    docObj(obj, result, tabs);

    return result;
};

const generateDocumentation = (documentation, routes) => {
    routes.forEach((route) => {
        documentation.push({ h2: route.description });
        documentation.push({ h3: 'Method' });
        documentation.push({ p: route.method });
        documentation.push({ h3: 'URL' });
        documentation.push({ p: route.url });
      
        if (route.json) {
          documentation.push({ h3: 'Response' });
          documentation.push({ code: getJSONDocs(route.json) });
        }
    });
};



module.exports = generateDocumentation;