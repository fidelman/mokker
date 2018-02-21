function parseObject(obj) {
  const parsedObject = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    let type = typeof value;

    if (Array.isArray(value)) {
      type = parseArray(value); // eslint-disable-line
    } else if (value === null) {
      type = 'null';
    } else if (type === 'object') {
      type = parseObject(value);
    }

    parsedObject[key] = type;
  });

  return parsedObject;
}

function parseArray(arr) {
  let parsedArray;
  const firstItem = arr[0];

  if (!firstItem) {
    parsedArray = '[]';
  } else if (Array.isArray(firstItem)) {
    parsedArray = `${parseArray(firstItem)}[]`;
  } else if (typeof firstItem === 'object') {
    parsedArray = parseObject(firstItem);
  } else {
    parsedArray = `${typeof firstItem}[]`;
  }

  return parsedArray;
}

const isPropMandatory = (types, matches, possibleMatches) => {
  let isMandatory = false;

  if (types.includes('null') || types.includes('undefined')) {
    isMandatory = false;
  } else if (matches === possibleMatches) {
    isMandatory = true;
  }

  return isMandatory;
};

const getMandatoryFlag = ({
  types,
  matches,
  possibleMatches,
  flagIfYes,
  flagIfNo
}) => (isPropMandatory(types, matches, possibleMatches) ? flagIfYes : flagIfNo);

const findTypesObjects = types => types.filter(type => typeof type === 'object');
const findTypesNoObjects = types => types.filter(type => typeof type !== 'object');

const generateTypesWithMergedObjects = (types) => {
  const typesObjects = findTypesObjects(types);
  let typesWithMergedObjects = types;

  if (typesObjects.length > 1) {
    const merged = Object.assign({}, ...typesObjects);

    const JSONFromTernary = getJSONFromTernary({ // eslint-disable-line
      objs: typesObjects,
      merged
    });

    typesWithMergedObjects = [].concat(findTypesNoObjects(types), JSONFromTernary);
  }

  return typesWithMergedObjects;
};

const generateJSONValue = (types) => {
  let JSONValue = '';

  const typesWithMergedObject = generateTypesWithMergedObjects(types);

  const typesWithoutNullAndUndef = typesWithMergedObject.filter(type => type !== 'undefined' && type !== 'null');

  typesWithoutNullAndUndef.forEach((item, index) => {
    if (typeof item === 'object') {
      JSONValue += `${JSON.stringify(item, null, 2)}`;
    } else {
      JSONValue += `${item}`;
    }

    if (index < typesWithoutNullAndUndef.length - 1) JSONValue += ' | ';
  });

  return JSONValue;
};

const parseStringifiedObject = (stringifiedObject) => {
  const parsedObject = {};
  Object.keys(stringifiedObject).forEach((key) => {
    const value = stringifiedObject[key];
    const type = typeof value;

    if (type === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object') {
          parsedObject[key] = parseStringifiedObject(parsed);
        } else {
          parsedObject[key] = value;
        }
      } catch (e) {
        parsedObject[key] = value;
      }
    } else {
      parsedObject[key] = value;
    }
  });

  return parsedObject;
};

function getJSONFromTernary(ternaryObject) {
  const { merged, objs } = ternaryObject;
  const mergedKeys = Object.keys(merged);

  const stringifiedObject = {};

  mergedKeys.forEach((key) => {
    let matches = 0;
    const types = [];

    objs.forEach((obj) => {
      if (key in obj) {
        const value = obj[key];
        matches += 1;
        let type = typeof value;

        if (Array.isArray(value)) {
          type = parseArray(value);
        } else if (value === null) {
          type = 'null';
        } else if (typeof value === 'object') {
          type = parseObject(value);
        }

        if (!types.includes(type)) types.push(type);
      }
    });

    const mandatoryFlag = getMandatoryFlag({
      types,
      matches,
      possibleMatches: objs.length,
      flagIfYes: '',
      flagIfNo: '?'
    });
    const JSONKey = `${mandatoryFlag}${key}`;
    const JSONValue = generateJSONValue(types);

    stringifiedObject[JSONKey] = JSONValue;
  });

  const JSONFromTernary = parseStringifiedObject(stringifiedObject);

  return JSONFromTernary;
}

const getParamsFromUrl = (url) => {
  const paramsFromUrl = {};
  url
    .split('?')[0]
    .split('/')
    .filter(item => item.includes(':'))
    .forEach((param) => {
      paramsFromUrl[param.replace(':', '')] = '';
    }); // all route params are strings

  return paramsFromUrl;
};

const getDataFromArray = (array) => {
  const data = {};
  array.forEach((item) => {
    data[item] = '';
  });
  return data;
};

const getArrayOfJSON = (json) => {
  const string = JSON.stringify(json, null, 2).replace(/\\"/g, "'").replace(/\\n/g, `
  `);

  const array = string.split('\n');

  return array;
};

const generateDocsFromArray = (array) => {
  const docs = {
    language: 'js',
    content: []
  };

  getArrayOfJSON(array).forEach(item => docs.content.push(item));

  return docs;
};

const generateDocsFromObject = (response, body, hostQuery = [], queryArray = [], url = '') => {
  const docs = {
    language: 'js',
    content: []
  };

  let json;

  if (typeof response === 'object') {
    json = parseObject(response);
  } else {
    const responseJSON = response({
      body,
      params: getParamsFromUrl(url),
      query: getDataFromArray(queryArray),
      hostQuery: getDataFromArray(hostQuery)
    });

    if ('@m_docs' in responseJSON) {
      json = getJSONFromTernary(responseJSON['@m_docs']);
    } else {
      json = parseObject(responseJSON);
    }
  }

  getArrayOfJSON(json).forEach(item => docs.content.push(item));

  return docs;
};

const getFileName = fileName => `${fileName.toLocaleLowerCase().replace(new RegExp(' ', 'g'), '-')}.md`;

export default (route) => {
  const { docs } = route;
  const fileContent = [];

  fileContent.push({
    h1: docs.title
  });

  if (docs.description) {
    fileContent.push({
      blockquote: docs.description
    });
  }

  fileContent.push({
    h2: 'Method'
  });

  fileContent.push({
    p: route.method.toLocaleUpperCase()
  });

  fileContent.push({
    h2: 'URL'
  });

  fileContent.push({
    code: {
      language: 'js',
      content: [route.url.split('?')[0]] // ignore query params
    }
  });

  if (docs.hostQuery) {
    fileContent.push({
      h2: 'Host Query Parameters'
    });
    fileContent.push({
      blockquote: 'For mock development'
    });
    fileContent.push({
      code: generateDocsFromArray(docs.hostQuery)
    });
  }

  if (docs.query) {
    fileContent.push({
      h2: 'Query Parameters'
    });
    fileContent.push({
      code: generateDocsFromArray(docs.query)
    });
  }

  if (docs.body) {
    fileContent.push({
      h2: 'Body'
    });
    fileContent.push({
      code: generateDocsFromObject(docs.body)
    });
  }

  if (route.json) {
    fileContent.push({
      h2: 'Response'
    });
    fileContent.push({
      code: generateDocsFromObject(route.json)
    });
  } else if (route.controller) {
    fileContent.push({
      h2: 'Response'
    });
    fileContent.push({
      code: generateDocsFromObject(route.controller, docs.body, docs.hostQuery, docs.query, route.url)
    });
  }

  const fileName = getFileName(docs.fileName);

  return {
    fileName,
    fileContent
  };
};
