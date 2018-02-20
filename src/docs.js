const generateTab = number => new Array(number).join('  ');

function docArr(array, result, tabsArg) {
  const value = array[0];
  let tabs = tabsArg;

  tabs += 1;
  const tabsString = generateTab(tabs);

  if (Array.isArray(value)) {
    result.content.push(`${tabsString}[`);
    docArr(value, result, tabs);
  } else if (typeof value === 'object') {
    result.content.push(`${tabsString}{`);
    docObj(value, result, tabs); // eslint-disable-line no-use-before-define
  } else {
    result.content.push(`${tabsString}${typeof value},`);
  }

  result.content.push(`${generateTab(tabs - 1)}]`);
}

function docObj(obj, result, tabsArg) {
  let tabs = tabsArg;
  tabs += 1;
  const tabsString = generateTab(tabs);

  Object.keys(obj).forEach((key) => {
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
  });

  result.content.push(`${generateTab(tabs - 1)}}`);
}

const getParamsFromUrl = (url) => {
  const paramsObj = {};
  url
    .split('?')[0]
    .split('/')
    .filter(item => item.includes(':'))
    .forEach((param) => {
      paramsObj[param.replace(':', '')] = '';
    }); // all route params are strings

  return paramsObj;
};

const getJSONDocs = (stuff, body, query, url) => {
  const result = {
    language: 'js',
    content: ['{']
  };

  const tabs = 1;

  if (typeof stuff === 'object') {
    docObj(stuff, result, tabs);
  } else {
    const obj = stuff({
      body,
      params: getParamsFromUrl(url),
      query
    });

    docObj(obj, result, tabs);
  }

  return result;
};

const getFileName = fileName => `${fileName.toLocaleLowerCase().replace(new RegExp(' ', 'g'), '-')}.md`;

export const getObjForCnd = (iftrue, iffalse) => {
  const result = [];
  if (typeof iftrue === 'object') result.push(iftrue);
  if (typeof iffalse === 'object') result.push(iffalse);
  return result;
};

export default (route) => {
  const { docs } = route;

  const file = [
    { h1: docs.title },

    { blockquote: docs.description },

    { h2: 'Method' },
    { p: route.method.toLocaleUpperCase() },

    { h2: 'URL' },
    {
      code: {
        language: 'js',
        content: [route.url.split('?')[0]] // ignore query params
      }
    }
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
    file.push({ code: getJSONDocs(route.controller, docs.parameters, docs.query, route.url) });
  }

  const fileName = getFileName(docs.fileName);

  return {
    fileName,
    file
  };
};
